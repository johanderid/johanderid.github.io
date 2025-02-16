
import { Cloud, Server, Shield, Users } from "lucide-react";

const services = [
  {
    icon: Cloud,
    title: "Cloud Migration",
    description: "Expert guidance in transitioning your infrastructure to Microsoft Azure",
  },
  {
    icon: Server,
    title: "Infrastructure Optimization",
    description: "Streamline your cloud resources for maximum efficiency and cost-effectiveness",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Implement robust security measures and maintain compliance standards",
  },
  {
    icon: Users,
    title: "Team Training",
    description: "Empower your team with cloud technology expertise",
  },
];

export const Services = () => {
  return (
    <section className="py-20 bg-gray-50" id="services">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-medium">Services</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Cloud Solutions Expertise</h2>
          <p className="text-gray-600">Comprehensive cloud consulting services tailored to your business needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
