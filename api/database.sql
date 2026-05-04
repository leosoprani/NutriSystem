CREATE TABLE IF NOT EXISTS tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL DEFAULT 'admin123',
    slug VARCHAR(100) NOT NULL UNIQUE,
    plan VARCHAR(50) DEFAULT 'Básico',
    monthly_value DECIMAL(10,2) DEFAULT 149.90,
    status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(100) DEFAULT 'admin',
    phone VARCHAR(20),
    birth_date DATE,
    plan_type VARCHAR(100),
    status ENUM('Ativo', 'Aguardando', 'Inativo') DEFAULT 'Ativo',
    last_visit DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_database (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT, -- Opcional: para alimentos personalizados por clínica
    name VARCHAR(255) NOT NULL,
    portion_value FLOAT,
    portion_unit VARCHAR(50),
    calories FLOAT,
    protein FLOAT,
    carbs FLOAT,
    fats FLOAT,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meal_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT,
    patient_id INT,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS anthropometry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT,
    patient_id INT,
    date DATE,
    weight FLOAT,
    height FLOAT,
    bmi FLOAT,
    fat_mass_pct FLOAT,
    lean_mass_pct FLOAT,
    chest FLOAT,
    waist FLOAT,
    abdomen FLOAT,
    hip FLOAT,
    biceps FLOAT,
    thigh FLOAT,
    calf FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT,
    patient_id INT,
    sender ENUM('doctor', 'patient', 'ai') NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Dados de exemplo (Tenant 1)
INSERT INTO tenants (name, email, slug, plan) VALUES ('Dr. João Pereira', 'joao@nutri.com', 'joao-pereira', 'Premium');
SET @tenant_id = LAST_INSERT_ID();

INSERT INTO patients (tenant_id, name, email, password, plan_type, status, last_visit) VALUES 
(@tenant_id, 'Ana Beatriz Silva', 'ana.beatriz@email.com', 'admin', 'Hipertrofia', 'Ativo', NOW()),
(@tenant_id, 'Carlos Eduardo Santos', 'carlos.edu@email.com', 'admin', 'Emagrecimento', 'Ativo', NOW()),
(@tenant_id, 'Mariana Oliveira', 'mari.oliveira@email.com', 'admin', 'Performance', 'Aguardando', NOW());
