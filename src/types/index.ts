export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

export interface ProjectDetail extends Project {
  fullDescription?: string;
  technologies?: string[];
  githubUrl?: string;
  demoUrl?: string;
}
