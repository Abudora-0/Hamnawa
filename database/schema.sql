-- Hamnawa database schema for MySQL 8
-- utf8mb4 is needed so Urdu text is stored correctly.

CREATE DATABASE IF NOT EXISTS hamnawa
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hamnawa;

-- One row per uploaded document.
CREATE TABLE IF NOT EXISTS documents (
  id                CHAR(36)     NOT NULL PRIMARY KEY,
  title             VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_type         ENUM('pdf', 'pptx') NOT NULL,
  page_count        INT          NOT NULL DEFAULT 0,
  storage_path      VARCHAR(500) NOT NULL,
  status            ENUM('processing', 'ready', 'failed') NOT NULL DEFAULT 'ready',
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at        DATETIME     NOT NULL,
  INDEX idx_documents_expires_at (expires_at)
) ENGINE=InnoDB;

-- Headings. parent_id is NULL for top level sections.
-- order_no is the position among siblings, starting at 1.
CREATE TABLE IF NOT EXISTS sections (
  id             INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  document_id    CHAR(36)     NOT NULL,
  parent_id      INT          NULL,
  title          VARCHAR(500) NOT NULL,
  level          TINYINT      NOT NULL,
  order_no       INT          NOT NULL,
  start_location INT          NOT NULL DEFAULT 1,
  CONSTRAINT fk_sections_document
    FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
  CONSTRAINT fk_sections_parent
    FOREIGN KEY (parent_id) REFERENCES sections (id) ON DELETE CASCADE,
  INDEX idx_sections_document (document_id, order_no)
) ENGINE=InnoDB;

-- Text inside a section. order_no is the position inside the section, starting at 1.
-- A notice is a spoken warning about content that could not be read.
CREATE TABLE IF NOT EXISTS content_blocks (
  id         INT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
  section_id INT      NOT NULL,
  kind       ENUM('paragraph', 'list_item', 'slide_text', 'notice') NOT NULL,
  text       TEXT     NOT NULL,
  location   INT      NOT NULL DEFAULT 1,
  order_no   INT      NOT NULL,
  CONSTRAINT fk_blocks_section
    FOREIGN KEY (section_id) REFERENCES sections (id) ON DELETE CASCADE,
  INDEX idx_blocks_section (section_id, order_no)
) ENGINE=InnoDB;

-- Cleanup query for the hourly job (the backend also deletes the stored files):
-- DELETE FROM documents WHERE expires_at < UTC_TIMESTAMP();
