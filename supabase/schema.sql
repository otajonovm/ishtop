-- Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'employer', 'job_seeker');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vacancy_status AS ENUM ('active', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('yangi', 'korib_chiqilmoqda', 'suhbatga_chaqirildi', 'qabul_qilindi', 'rad_etildi');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'remote', 'internship', 'contract');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'job_seeker' NOT NULL,
  avatar_url TEXT,
  company_id UUID, -- Will be set for employers
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  location TEXT,
  employer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to profiles for company_id if not exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_company_id_fkey') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Vacancies table
CREATE TABLE IF NOT EXISTS vacancies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  salary TEXT,
  location TEXT,
  job_type job_type DEFAULT 'full_time' NOT NULL,
  experience TEXT,
  deadline TIMESTAMPTZ,
  status vacancy_status DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vacancy_id UUID REFERENCES vacancies(id) ON DELETE CASCADE NOT NULL,
  job_seeker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status application_status DEFAULT 'yangi' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
