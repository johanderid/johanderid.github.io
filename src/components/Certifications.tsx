
import { motion } from "framer-motion";
import { Award, CheckCircle } from "lucide-react";

const certifications = [
  {
    name: "Azure Solutions Architect Expert",
    id: "AZ-305",
    date: "2023",
    description: "Design and implement cloud solutions",
  },
  {
    name: "Azure Administrator Associate",
    id: "AZ-104",
    date: "2023",
    description: "Implement, monitor, and maintain Microsoft Azure solutions",
  },
  {
    name: "Azure Security Engineer Associate",
    id: "AZ-500",
    date: "2023",
    description: "Implement security controls and threat protection",
  },
  {
    name: "Azure DevOps Engineer Expert",
    id: "AZ-400",
    date: "2023",
    description: "Design and implement DevOps practices",
  },
];

export const Certifications = () => {
  return (
    <section className="py-16 bg-muted" id="certifications">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-medium"
          >
            Certifications
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mt-2 mb-3"
          >
            Microsoft Azure Certifications
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-sm md:text-base"
          >
            Industry-recognized certifications demonstrating expertise in cloud technologies
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-base truncate pr-2">{cert.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">{cert.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-gray-600">{cert.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{cert.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
