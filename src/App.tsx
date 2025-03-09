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
          className="bg-blue-500 text-white p-2 rounded mb-2 w-full text-left hover:bg-blue-600"
        >
          {showLogic ? 'Hide' : 'Show'} Naming Convention Logic
        </button>
        {showLogic && (
          <div className="text-base">
            <p><strong>How Resource Names Are Generated</strong></p>
            <p>This tool follows the Azure Cloud Adoption Framework (CAF) guidelines. The default pattern is <code>{'{resource_type}-{workload}-{environment}-{region}-{instance}'}</code>, but some resources have special rules:</p>
            <ol className="list-decimal ml-6">
              <li><strong>Components:</strong>
                <ul className="list-disc ml-6">
                  <li>Resource Type: E.g., <code>vm</code> (Virtual Machine). See <a href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations" target="_blank" className="text-blue-500">Azure abbreviations</a>.</li>
                  <li>Workload: Your app name (e.g., <code>myapp</code>).</li>
                  <li>Environment: E.g., <code>dev</code> (Development).</li>
                  <li>Region: E.g., <code>eastus</code> (East US).</li>
                  <li>Instance: Optional (e.g., <code>01</code>).</li>
                </ul>
              </li>
              <li><strong>Default Pattern:</strong> Example: <code>vm-myapp-dev-eastus-01</code></li>
              <li><strong>Special Cases:</strong>
                <ul className="list-disc ml-6">
                  <li>Storage Account (st): Max 24 chars, lowercase, no hyphens: <code>stmyappdeveastus01</code></li>
                  <li>Kubernetes Service (aks): Max 63 chars, lowercase: <code>aks-myapp-dev-eastus</code></li>
                  <li>Function App (func): Max 64 chars, hyphens allowed: <code>func-myapp-dev-eastus</code></li>
                  <li>App Service (app): Max 64 chars, hyphens allowed: <code>app-myapp-dev-eastus</code></li>
                  <li>Key Vault (kv): Max 24 chars, no instance: <code>kv-myapp-dev-eastus</code></li>
                  <li>Cosmos DB (cosmos): Max 64 chars, lowercase: <code>cosmos-myapp-dev-eastus</code></li>
                </ul>
              </li>
              <li><strong>Customization:</strong> Adjust in Settings, but resource limits apply.</li>
              <li><strong>Warnings:</strong> Notes for uniqueness or truncation appear as needed.</li>
            </ol>
          </div>
        )}

        <button
          onClick={() => setShowBestPractices(!showBestPractices)}
          className="bg-blue-500 text-white p-2 rounded w-full text-left hover:bg-blue-600"
        >
          {showBestPractices ? 'Hide' : 'Show'} Best Practices
        </button>
        {showBestPractices && (
          <div className="text-base">
            <p><strong>Best Practices for Naming Azure Resources</strong></p>
            <p>From Microsoft’s <a href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming-and-tagging-decision-guide" target="_blank" className="text-blue-500">Azure Naming Guide</a>:</p>
            <ol className="list-decimal ml-6">
              <li><strong>Consistency:</strong> Use a standard pattern. Tip: Short abbreviations (e.g., <code>dev</code>).</li>
              <li><strong>Readability:</strong> E.g., <code>vm-webapp-prod-eastus-01</code>.</li>
              <li><strong>Compliance:</strong> Follow Azure rules (e.g., lowercase for Storage Accounts).</li>
              <li><strong>Uniqueness:</strong> Add a prefix (e.g., <code>orgstmyappdeveastus01</code>) for global resources.</li>
              <li><strong>Scalability:</strong> Use instance numbers when needed.</li>
              <li><strong>Simplicity:</strong> Keep names short.</li>
              <li><strong>Documentation:</strong> Share this tool with your team.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;