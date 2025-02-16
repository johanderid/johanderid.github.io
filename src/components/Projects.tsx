
import { motion } from "framer-motion";
import { Server, Users, Lock, Database, Cloud, ChevronRight } from "lucide-react";

const projects = [
  {
    title: "Enterprise Cloud Migration",
    client: "Financial Services Company",
    duration: "6 months",
    technologies: ["Azure Virtual Machines", "Azure SQL", "Azure Active Directory"],
    description: "Large-scale migration of on-premises infrastructure to Azure cloud",
    challenges: [
      "Legacy system compatibility",
      "Minimal downtime requirements",
      "Data security compliance",
    ],
    solutions: [
      "Implemented hybrid cloud architecture",
      "Used Azure Site Recovery for seamless migration",
      "Established secure VPN connections",
    ],
    outcomes: [
      "40% reduction in operational costs",
      "99.99% system availability",
      "Enhanced security posture",
    ],
    icon: Server,
  },
  {
    title: "Cloud Security Enhancement",
    client: "Healthcare Provider",
    duration: "3 months",
    technologies: ["Azure Security Center", "Azure Sentinel", "Azure Key Vault"],
    description: "Implementation of comprehensive security solutions for HIPAA compliance",
    challenges: [
      "Complex compliance requirements",
      "Multiple system integrations",
      "Real-time monitoring needs",
    ],
    solutions: [
      "Deployed Azure Sentinel for SIEM",
      "Implemented zero-trust architecture",
      "Automated security policies",
    ],
    outcomes: [
      "Achieved HIPAA compliance",
      "Reduced security incidents by 75%",
      "Automated 90% of security responses",
    ],
    icon: Lock,
  },
  {
    title: "Data Platform Modernization",
    client: "Retail Corporation",
    duration: "4 months",
    technologies: ["Azure Synapse Analytics", "Azure Data Factory", "Power BI"],
    description: "Modernization of data warehouse and analytics platform",
    challenges: [
      "Large data volume migration",
      "Real-time analytics requirements",
      "Complex data transformations",
    ],
    solutions: [
      "Implemented Azure Synapse Analytics",
      "Created automated ETL pipelines",
      "Developed real-time dashboards",
    ],
    outcomes: [
      "70% faster data processing",
      "Real-time analytics capabilities",
      "Reduced data storage costs by 50%",
    ],
    icon: Database,
  },
];

export const Projects = () => {
  return (
    <section className="py-16 bg-white" id="projects">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-medium"
          >
            Projects
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mt-2 mb-3"
          >
            Recent Implementation Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-sm md:text-base"
          >
            Detailed case studies of successful cloud transformation projects
          </motion.p>
        </div>
        <div className="max-w-6xl mx-auto space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-muted rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <project.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <span className="text-sm text-gray-500">{project.duration}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Client: {project.client}</p>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-primary" />
                        Challenges
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {project.challenges.map((challenge) => (
                          <li key={challenge}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-primary" />
                        Solutions
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {project.solutions.map((solution) => (
                          <li key={solution}>{solution}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-primary" />
                        Outcomes
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {project.outcomes.map((outcome) => (
                          <li key={outcome}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-primary" />
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
