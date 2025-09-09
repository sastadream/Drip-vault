export const DEPARTMENTS = [
  { name: 'Biomedical Engineering', slug: 'biomedical-engineering' },
  { name: 'Computer Engineering', slug: 'computer-engineering' },
  { name: 'Electronics and Communication Engineering', slug: 'electronics-and-communication-engineering' },
  { name: 'Information Technology', slug: 'information-technology' },
  { name: 'Instrumentation and Control Engineering', slug: 'instrumentation-and-control-engineering' },
  { name: 'Metallurgy Engineering', slug: 'metallurgy-engineering' },
  { name: 'Mechanical Engineering', slug: 'mechanical-engineering' },
  { name: 'Civil Engineering', slug: 'civil-engineering' },
  { name: 'Robotic and Automation Engineering', slug: 'robotic-and-automation-engineering' },
  { name: 'Electrical Engineering', slug: 'electrical-engineering' },
];

export const SEMESTERS = Array.from({ length: 8 }, (_, i) => ({
  name: `Semester ${i + 1}`,
  slug: `sem-${i + 1}`,
}));

export const SUBJECTS: Record<string, Record<string, { name: string; slug: string }[]>> = {
  'robotic-and-automation-engineering': {
    'sem-1': [
      { name: 'BME', slug: 'bme' },
      { name: 'BEE', slug: 'bee' },
      { name: 'MATHS-1', slug: 'maths-1' },
      { name: 'IPDC', slug: 'ipdc' },
      { name: 'DESIGN THINKING', slug: 'design-thinking' },
    ],
  },
};
