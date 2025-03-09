import React, { useState, useEffect } from 'react';
import { Settings, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import resourceCategories from '../data/resource_categories.json';
import environments from '../data/environments.json';
import regions from '../data/regions.json';

interface Resource {
  name: string;
  abbreviation: string;
  namingPattern: string;
  maxLength: number;
  allowedCharacters: string;
  description: string;
}

interface FormData {
  category: string;
  resourceType: string;
  workload: string;
  environment: string;
  region: string;
  instance: string;
  department: string;
  businessUnit: string;
}

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

const DEFAULT_PATTERN = '{resource_type}-{workload}-{environment}-{region}-{instance}';

export default function NameGenerator() {
  const [pattern, setPattern] = useLocalStorage('namingPattern', DEFAULT_PATTERN);
  const [showSettings, setShowSettings] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    category: '',
    resourceType: '',
    workload: '',
    environment: '',
    region: '',
    instance: '',
    department: '',
    businessUnit: '',
  });
  const [generatedName, setGeneratedName] = useState('');
  const [showDepartment, setShowDepartment] = useState(false);
  const [showBusinessUnit, setShowBusinessUnit] = useState(false);
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    warnings: [],
    errors: [],
  });

  useEffect(() => {
    setShowDepartment(pattern.includes('{department}'));
    setShowBusinessUnit(pattern.includes('{business_unit}'));
  }, [pattern]);

  useEffect(() => {
    if (formData.category) {
      setAvailableResources(resourceCategories[formData.category as keyof typeof resourceCategories]?.resources || []);
      setFormData(prev => ({ ...prev, resourceType: '' }));
      setSelectedResource(null);
    }
  }, [formData.category]);

  useEffect(() => {
    if (formData.resourceType && formData.category) {
      const resource = resourceCategories[formData.category as keyof typeof resourceCategories]?.resources.find(
        r => r.name === formData.resourceType
      );
      setSelectedResource(resource || null);
      if (resource) {
        setPattern(resource.namingPattern); // Use resource-specific pattern
      }
    }
  }, [formData.resourceType, formData.category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateName = (name: string): ValidationResult => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!selectedResource) {
      return { isValid: true, warnings: [], errors: [] };
    }

    // Check length
    if (name.length > selectedResource.maxLength) {
      errors.push(`Name exceeds maximum length of ${selectedResource.maxLength} characters`);
    }

    // Check character restrictions
    if (selectedResource.allowedCharacters.includes('lowercase') && name !== name.toLowerCase()) {
      errors.push('Name must be lowercase');
    }

    if (selectedResource.allowedCharacters === 'lowercase alphanumeric' && !/^[a-z0-9]*$/.test(name)) {
      errors.push('Name can only contain lowercase alphanumeric characters');
    } else if (selectedResource.allowedCharacters === 'alphanumeric, hyphens' && !/^[a-zA-Z0-9-]*$/.test(name)) {
      errors.push('Name can only contain alphanumeric characters and hyphens');
    } else if (!/^[a-zA-Z0-9-_.]*$/.test(name)) {
      errors.push('Name can only contain alphanumeric characters, hyphens, underscores, and periods');
    }

    // Add description as a warning
    warnings.push(selectedResource.description);

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
    };
  };

  const generateName = () => {
    if (!selectedResource) return;

    let name = selectedResource.namingPattern; // Use resource-specific pattern
    const selectedEnv = environments.find(env => env.name === formData.environment);
    const selectedRegion = regions.find(reg => reg.name === formData.region);

    const values = {
      resource_type: selectedResource.abbreviation,
      workload: formData.workload.toLowerCase() || 'app',
      environment: selectedEnv?.abbreviation || formData.environment.toLowerCase() || 'env',
      region: selectedRegion?.abbreviation || formData.region.toLowerCase() || 'region',
      instance: formData.instance || '',
      department: formData.department.toLowerCase() || '',
      business_unit: formData.businessUnit.toLowerCase() || '',
    };

    Object.entries(values).forEach(([key, value]) => {
      name = name.replace(`{${key}}`, value);
    });

    // Clean up trailing separators if instance is omitted
    if (!formData.instance && name.endsWith('-')) {
      name = name.slice(0, -1);
    }

    // Enforce lowercase if required
    if (selectedResource.allowedCharacters.includes('lowercase')) {
      name = name.toLowerCase();
    }

    // Remove hyphens if not allowed
    if (!selectedResource.allowedCharacters.includes('hyphens')) {
      name = name.replace(/-/g, '');
    }

    // Truncate if necessary
    if (name.length > selectedResource.maxLength) {
      name = name.slice(0, selectedResource.maxLength);
    }

    setGeneratedName(name);
    setValidation(validateName(name));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Azure Resource Name Generator</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {showSettings && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Naming Pattern Settings</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Custom Pattern
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter custom pattern"
                />
              </label>
              <p className="text-sm text-gray-500">
                Available placeholders: {'{resource_type}'}, {'{workload}'}, {'{environment}'}, {'{region}'}, {'{instance}'}, {'{department}'}, {'{business_unit}'}
              </p>
              {selectedResource && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-800">Resource-Specific Pattern</h3>
                  <p className="text-sm text-blue-600">
                    Recommended pattern: {selectedResource.namingPattern}
                  </p>
                  <p className="text-sm text-blue-600">
                    Max length: {selectedResource.maxLength} characters
                  </p>
                  <p className="text-sm text-blue-600">
                    Allowed characters: {selectedResource.allowedCharacters}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); generateName(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resource Category
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Resource Category</option>
                  {Object.entries(resourceCategories).map(([category]) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Resource Type
                <select
                  name="resourceType"
                  value={formData.resourceType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={!formData.category}
                >
                  <option value="">Select Resource Type</option>
                  {availableResources.map(resource => (
                    <option key={resource.abbreviation} value={resource.name}>
                      {resource.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Workload/Application
                <input
                  type="text"
                  name="workload"
                  value={formData.workload}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., myapp"
                  required
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Environment
                <select
                  name="environment"
                  value={formData.environment}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Environment</option>
                  {environments.map(env => (
                    <option key={env.abbreviation} value={env.name}>
                      {env.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Region
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Region</option>
                  {regions.map(region => (
                    <option key={region.abbreviation} value={region.name}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {showDepartment && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., finance"
                    required
                  />
                </label>
              </div>
            )}

            {showBusinessUnit && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Unit
                  <input
                    type="text"
                    name="businessUnit"
                    value={formData.businessUnit}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., retail"
                    required
                  />
                </label>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instance (Optional)
                <input
                  type="text"
                  name="instance"
                  value={formData.instance}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 01"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate Name
            </button>
          </div>
        </form>

        {generatedName && (
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Generated Resource Name:</h2>
              <div className="p-4 bg-white rounded border border-gray-200">
                <code className="text-lg font-mono">{generatedName}</code>
              </div>
            </div>

            {selectedResource && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Resource Requirements:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-700">Max Length:</span>
                    <span>{selectedResource.maxLength} characters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-700">Allowed Characters:</span>
                    <span>{selectedResource.allowedCharacters}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-700">Note:</span>
                    <span>{selectedResource.description}</span>
                  </li>
                </ul>
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Warnings:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-700">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.errors.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Errors:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-red-700">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}