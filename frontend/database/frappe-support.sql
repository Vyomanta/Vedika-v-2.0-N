CREATE TABLE IF NOT EXISTS `tabLMS Session Document` (
 name VARCHAR(128) PRIMARY KEY,creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,modified TIMESTAMP NULL,modified_by VARCHAR(255),owner VARCHAR(255),docstatus INT DEFAULT 0,idx INT DEFAULT 0,
 file_name TEXT,file_key TEXT,session_id VARCHAR(255),course_id VARCHAR(255),tenant_id VARCHAR(128),status VARCHAR(32) DEFAULT 'pending_ingestion'
);
CREATE TABLE IF NOT EXISTS `LMS Document Chunk` (
 id VARCHAR(128) PRIMARY KEY,document_id VARCHAR(128),session_id VARCHAR(255),user_id VARCHAR(255),course_id VARCHAR(255),tenant_id VARCHAR(128),
 chunk_index INT,page_number INT,content MEDIUMTEXT,embedding VECTOR(768),embedding_model VARCHAR(128),embedding_version VARCHAR(32),content_hash VARCHAR(128),is_flagged INT DEFAULT 0,
 INDEX idx_chunk_scope(tenant_id,session_id)
);
CREATE TABLE IF NOT EXISTS `LMS Background Job Queue` (
 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,document_id VARCHAR(128) NOT NULL,tenant_id VARCHAR(128) NOT NULL,status VARCHAR(32) DEFAULT 'queued',attempts INT DEFAULT 0,max_attempts INT DEFAULT 3,error_message TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS `LMS RAG Audit Log` (
 id VARCHAR(128) PRIMARY KEY,user_id VARCHAR(255),action VARCHAR(128),document_id VARCHAR(128),session_id VARCHAR(255),tenant_id VARCHAR(128),ip_address VARCHAR(255),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS tab_tutor_sessions (
 id VARCHAR(64) PRIMARY KEY,user_id VARCHAR(128) NOT NULL,type VARCHAR(32) DEFAULT 'general',label VARCHAR(255) DEFAULT 'Untitled Chat',mode VARCHAR(32) DEFAULT 'Beginner',length VARCHAR(32) DEFAULT 'Short',
 messages MEDIUMTEXT NOT NULL,documents TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 INDEX idx_user_type_updated(user_id,type,updated_at)
);
