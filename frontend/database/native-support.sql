-- Additive application support tables. No production records are deleted.
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(128) NOT NULL DEFAULT 'default';
ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled INTEGER NOT NULL DEFAULT 1;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(128) NOT NULL DEFAULT 'default';
CREATE INDEX IF NOT EXISTS idx_courses_tenant ON courses(tenant_id,status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email));
CREATE TABLE IF NOT EXISTS course_instructors (id TEXT PRIMARY KEY, course_id TEXT NOT NULL, instructor TEXT NOT NULL);
CREATE OR REPLACE VIEW "tabCourse Instructor" AS SELECT id AS name,course_id AS parent,instructor FROM course_instructors;
CREATE OR REPLACE VIEW "tabLMS Enrollment" AS SELECT e.id::text AS name,e.course_id AS course,u.email AS member FROM enrollments e JOIN users u ON u.id=e.user_id;
CREATE TABLE IF NOT EXISTS tab_tutor_sessions (
 id VARCHAR(64) PRIMARY KEY,user_id VARCHAR(128) NOT NULL,type VARCHAR(32) NOT NULL DEFAULT 'general',label VARCHAR(255) NOT NULL DEFAULT 'Untitled Chat',
 mode VARCHAR(32) NOT NULL DEFAULT 'Beginner',length VARCHAR(32) NOT NULL DEFAULT 'Short',messages TEXT NOT NULL,documents TEXT,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tutor_owner ON tab_tutor_sessions(user_id,type,updated_at DESC);
CREATE TABLE IF NOT EXISTS "tabLMS Session Document" (
 name VARCHAR(128) PRIMARY KEY, creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,modified TIMESTAMP,modified_by TEXT,owner TEXT NOT NULL,docstatus INT DEFAULT 0,idx INT DEFAULT 0,
 file_name TEXT NOT NULL,file_key TEXT NOT NULL,session_id TEXT NOT NULL,course_id TEXT,tenant_id VARCHAR(128) NOT NULL,status TEXT DEFAULT 'pending_ingestion'
);
CREATE INDEX IF NOT EXISTS idx_document_scope ON "tabLMS Session Document"(tenant_id,owner,session_id);
CREATE TABLE IF NOT EXISTS "LMS Background Job Queue" (
 id BIGSERIAL PRIMARY KEY,document_id VARCHAR(128) REFERENCES "tabLMS Session Document"(name) ON DELETE CASCADE,tenant_id VARCHAR(128) NOT NULL,
 status TEXT NOT NULL DEFAULT 'queued',attempts INT DEFAULT 0,max_attempts INT DEFAULT 3,error_message TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,locked_at TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "LMS Document Chunk" (
 id VARCHAR(128) PRIMARY KEY,document_id VARCHAR(128) REFERENCES "tabLMS Session Document"(name) ON DELETE CASCADE,session_id TEXT,user_id TEXT,course_id TEXT,tenant_id VARCHAR(128) NOT NULL,
 chunk_index INT,page_number INT,content TEXT,embedding JSONB,embedding_model TEXT,embedding_version TEXT,content_hash TEXT,is_flagged INT DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_chunk_scope ON "LMS Document Chunk"(tenant_id,session_id,user_id);
CREATE TABLE IF NOT EXISTS "LMS RAG Audit Log" (id TEXT PRIMARY KEY,user_id TEXT,action TEXT,document_id TEXT,session_id TEXT,tenant_id VARCHAR(128),ip_address TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS pdf_categories (id TEXT PRIMARY KEY,category TEXT NOT NULL,subcategory TEXT NOT NULL,created_at TIMESTAMP,updated_at TIMESTAMP);
CREATE TABLE IF NOT EXISTS pdf_resources (id TEXT PRIMARY KEY,category_id TEXT REFERENCES pdf_categories(id),name TEXT NOT NULL,file_link TEXT NOT NULL,thumbnail TEXT,created_at TIMESTAMP,updated_at TIMESTAMP);
CREATE OR REPLACE VIEW pdf_library_view AS SELECT r.*,c.category,c.subcategory FROM pdf_resources r JOIN pdf_categories c ON c.id=r.category_id;
-- Portable cosine search; a provider-specific vector index can replace this adapter later.
CREATE OR REPLACE FUNCTION vedika_cosine_similarity(a JSONB,b JSONB) RETURNS DOUBLE PRECISION LANGUAGE SQL IMMUTABLE AS $$
 SELECT COALESCE(SUM(x.value::double precision*y.value::double precision)/NULLIF(SQRT(SUM(POWER(x.value::double precision,2)))*SQRT(SUM(POWER(y.value::double precision,2))),0),0)
 FROM jsonb_array_elements_text(a) WITH ORDINALITY AS x(value,i)
 JOIN jsonb_array_elements_text(b) WITH ORDINALITY AS y(value,i) USING(i)
$$;
