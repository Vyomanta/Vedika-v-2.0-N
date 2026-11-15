# Project map

Routes and compatibility imports remain stable. Feature implementation is under frontend/features; common infrastructure is under frontend/shared and backend integrations under frontend/integrations.

- [administration](frontend/features/administration/README.md): api, hooks, pages, server, styles
- [assessments](frontend/features/assessments/README.md): api, assignments, components, domain, hooks, pages, quizzes, server, styles
- [auth](frontend/features/auth/README.md): api, components, hooks, pages, server, styles
- [code-playground](frontend/features/code-playground/README.md): components, hooks, styles
- [code-puzzles](frontend/features/code-puzzles/README.md): components, hooks, server, styles
- [code-visualizer](frontend/features/code-visualizer/README.md): components, hooks, styles
- [coding-tutor](frontend/features/coding-tutor/README.md): components, styles
- [cohorts](frontend/features/cohorts/README.md): api, pages, styles
- [courses](frontend/features/courses/README.md): api, components, domain, hooks, pages, server, styles
- [dashboard](frontend/features/dashboard/README.md): components, styles
- [diagrams](frontend/features/diagrams/README.md): components, hooks, styles
- [documents](frontend/features/documents/README.md): server
- [general-tutor](frontend/features/general-tutor/README.md): components, styles
- [infographics](frontend/features/infographics/README.md): api, components, domain, hooks, server, styles
- [labs](frontend/features/labs/README.md): components, data, hooks, server, styles
- [landing](frontend/features/landing/README.md): components, hooks, pages, styles
- [lessons](frontend/features/lessons/README.md): components, hooks, pages, styles
- [lms-gateway](frontend/features/lms-gateway/README.md): server
- [mascot](frontend/features/mascot/README.md): api, components, hooks, server, styles
- [memory](frontend/features/memory/README.md): server
- [navigation](frontend/features/navigation/README.md): components, styles
- [opportunities](frontend/features/opportunities/README.md): api, pages, styles
- [progress](frontend/features/progress/README.md): api, components, server, styles
- [resources](frontend/features/resources/README.md): components, data, server, styles
- [shared-widgets](frontend/features/shared-widgets/README.md): components, styles
- [tutoring](frontend/features/tutoring/README.md): api, domain, server
- [video-tutor](frontend/features/video-tutor/README.md): components, hooks, server, styles
- [visual-effects](frontend/features/visual-effects/README.md): components, styles
- [viva-interview](frontend/features/viva-interview/README.md): pages, server, styles
- [voice-tutor](frontend/features/voice-tutor/README.md): api, components, hooks, server, styles

## Reference feature

- [Quiz UI](frontend/features/assessments/quizzes/components/QuizCatalog.jsx), [quiz state](frontend/features/assessments/quizzes/hooks/useQuizWorkspace.js), and quiz styles under the same subfeature.
- [Assignment UI](frontend/features/assessments/assignments/components/AssignmentCatalog.jsx), [assignment state](frontend/features/assessments/assignments/hooks/useAssignmentWorkspace.js), and assignment styles under the same subfeature.
- [Shared server service](frontend/features/assessments/server/service.cjs), [SQL repository](frontend/features/assessments/server/repository.cjs), and [authorization/grading policy](frontend/features/assessments/domain/policy.cjs).
- [Full source-to-module map](frontend/architecture/feature-map.json).

Voice entry points remain frontend/voice-server.js and frontend/server-with-ws.js. The worker entry is backend/queue_worker.py, with backend/database_connection.py selecting the database. Deployment identity is frontend/deployment.json; private environment files are never part of the shared source.
