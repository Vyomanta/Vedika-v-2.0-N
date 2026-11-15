#!/bin/bash
set -euo pipefail
export MALLOC_ARENA_MAX=2
export PORT="${PORT:-8000}"
export FRAPPE_STREAM_LOGGING=1
redis-server --daemonize yes
until redis-cli ping | grep -q PONG; do sleep 1; done
python3 /home/frappe/dummy_server.py &
DUMMY_PID=$!
trap 'kill "$DUMMY_PID" 2>/dev/null || true' EXIT
cd /home/frappe/frappe-bench
# JSON serialization, isolated initialization, and schema validation are owned by
# this helper. It never drops existing tables or initializes the legacy database.
./env/bin/python /home/frappe/prepare_site.py
bench use lms.render
bench --site lms.render migrate
bench --site lms.render execute "exec(open('/home/frappe/import_legacy.py').read())"
bench --site lms.render execute "exec(open('/home/frappe/grant_question_perm.py').read())"
if [ "${QUEUE_WORKER_CONCURRENCY:-1}" -gt 0 ]; then
 for i in $(seq 1 "${QUEUE_WORKER_CONCURRENCY:-1}"); do
  ./env/bin/python /home/frappe/queue_worker.py &
 done
fi
kill "$DUMMY_PID" 2>/dev/null || true
wait "$DUMMY_PID" 2>/dev/null || true
trap - EXIT
# Production WSGI server; no development reloader or bench development server.
exec ./env/bin/gunicorn --chdir sites --pythonpath /home/frappe/frappe-bench --bind "0.0.0.0:$PORT" --workers 1 --threads 4 --timeout 120 frappe_wsgi:application
