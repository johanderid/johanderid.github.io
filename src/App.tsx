import React, { useState } from 'react';
import NameGenerator from './components/NameGenerator';

function App() {
  const [showLogic, setShowLogic] = useState(false);
  const [showBestPractices, setShowBestPractices] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <NameGenerator />
      <div className="max-w-4xl mx-auto mt-6 bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-bold mb-2">Naming Guide</h2>

        <button
          onClick={() => setShowLogic(!showLogic)}
          className="w-full text-left bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600 focus:outline-none"
        >
          {showLogic ? 'Hide' : 'Show'} Naming Convention Logic
        </button>
        {showLogic && (
          <div className="text-base mb-4">
            <p className="font-semibold">How Resource Names Are Generated</p>
            <p>This tool follows the Azure Cloud Adoption Framework (CAF) guidelines. The default pattern is <code>{'{resource_type}-{workload}-{environment}-{region}-{instance}'}</code>, but some resources have special rules:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-2">
              <li>
                <span className="font-semibold">Components:</span>
                <ul className="list-disc pl-5">
                  <li>Resource Type: E.g., <code>vm</code> (Virtual Machine). See <a href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations" target="_blank" className="text-blue-500 hover:underline">Azure abbreviations</a>.</li>
                  <li>Workload: Your app name (e.g., <code>myapp</code>).</li>
                  <li>Environment: E.g., <code>dev</code> (Development).</li>
                  <li>Region: E.g., <code>eastus</code> (East US).</li>
                  <li>Instance: Optional (e.g., <code>01</code>).</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Default Pattern:</span>
                <ul className="list-disc pl-5">
                  <li>Example: <code>vm-myapp-dev-eastus-01</code></li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Special Cases:</span>
                <ul className="list-disc pl-5">
                  <li>Storage Account (st): Max 24 chars, lowercase, no hyphens: <code>stmyappdeveastus01</code></li>
                  <li>Azure Kubernetes Service (aks): Max 63 chars, lowercase: <code>myapp-aks-dev-eastus-01</code></li>
                  <li>Function App (func): Max 60 chars, lowercase, no hyphens: <code>myappfuncdeveastus01</code></li>
                  <li>App Service (app): Max 60 chars, lowercase, no hyphens: <code>myappappdeveastus01</code></li>
                  <li>Key Vault (kv): Max 24 chars, no instance: <code>kvmyappdeveastus</code></li>
                  <li>Cosmos DB (cosmos): Max 44 chars, lowercase: <code>cosmos-myapp-dev-eastus-01</code></li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Customization:</span>
                <ul className="list-disc pl-5">
                  <li>Adjust in Settings, but resource limits apply.</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Warnings:</span>
                <ul className="list-disc pl-5">
                  <li>Notes for uniqueness or truncation appear as needed.</li>
                </ul>
              </li>
            </ol>
          </div>
        )}

        <button
          onClick={() => setShowBestPractices(!showBestPractices)}
          className="w-full text-left bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          {showBestPractices ? 'Hide' : 'Show'} Best Practices
        </button>
        {showBestPractices && (
          <div className="text-base">
            <p className="font-semibold">Best Practices for Naming Azure Resources</p>
            <p>From Microsoft’s <a href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming-and-tagging-decision-guide" target="_blank" className="text-blue-500 hover:underline">Azure Naming Guide</a>:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-2">
              <li>
                <span className="font-semibold">Consistency:</span> Use a standard pattern.
                <ul className="list-disc pl-5">
                  <li>Tip: Short abbreviations (e.g., <code>dev</code>).</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Readability:</span> E.g., <code>vm-webapp-prod-eastus-01</code>.
              </li>
              <li>
                <span className="font-semibold">Compliance:</span> Follow Azure rules (e.g., lowercase for Storage Accounts).
              </li>
              <li>
                <span className="font-semibold">Uniqueness:</span> Add a prefix (e.g., <code>orgstmyappdeveastus01</code>) for global resources.
              </li>
              <li>
                <span className="font-semibold">Scalability:</span> Use instance numbers when needed.
              </li>
              <li>
                <span className="font-semibold">Simplicity:</span> Keep names short.
              </li>
              <li>
                <span className="font-semibold">Documentation:</span> Share this tool with your team.
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;