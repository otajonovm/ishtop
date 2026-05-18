-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Companies Policies
CREATE POLICY "Companies are viewable by everyone." ON companies FOR SELECT USING (true);
CREATE POLICY "Employers can insert own company." ON companies FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update own company." ON companies FOR UPDATE USING (auth.uid() = employer_id);
CREATE POLICY "Admins can manage all companies." ON companies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Vacancies Policies
CREATE POLICY "Active vacancies are viewable by everyone." ON vacancies FOR SELECT USING (status = 'active' OR auth.uid() = employer_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Employers can insert own vacancies." ON vacancies FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update own vacancies." ON vacancies FOR UPDATE USING (auth.uid() = employer_id);
CREATE POLICY "Employers can delete own vacancies." ON vacancies FOR DELETE USING (auth.uid() = employer_id);
CREATE POLICY "Admins can manage all vacancies." ON vacancies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Applications Policies
CREATE POLICY "Job seekers can view own applications." ON applications FOR SELECT USING (auth.uid() = job_seeker_id);
CREATE POLICY "Employers can view applications for their vacancies." ON applications FOR SELECT USING (auth.uid() = employer_id);
CREATE POLICY "Job seekers can insert applications." ON applications FOR INSERT WITH CHECK (auth.uid() = job_seeker_id);
CREATE POLICY "Employers can update application status." ON applications FOR UPDATE USING (auth.uid() = employer_id);
CREATE POLICY "Admins can view all applications." ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Documents Policies
CREATE POLICY "Users can view own documents." ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Employers can view documents of applicants." ON documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM applications WHERE id = application_id AND employer_id = auth.uid())
);
CREATE POLICY "Users can insert own documents." ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all documents." ON documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can insert own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
