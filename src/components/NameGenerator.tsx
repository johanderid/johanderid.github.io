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
        setPattern(resource.namingPattern);
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

    if (name.length > selectedResource.maxLength) {
      errors.push(`Name exceeds maximum length of ${selectedResource.maxLength} characters`);
    }

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

    warnings.push(selectedResource.description);

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
    };
  };

  const generateName = () => {
    if (!selectedResource) return;

    let name = selectedResource.namingPattern;
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

    if (!formData.instance && name.endsWith('-')) {
      name = name.slice(0, -1);
    }

    if (selectedResource.allowedCharacters.includes('lowercase')) {
      name = name.toLowerCase();
    }

    if (!selectedResource.allowedCharacters.includes('hyphens')) {
      name = name.replace(/-/g, '');
    }

    if (name.length > selectedResource.maxLength) {
      name = name.slice(0, selectedResource.maxLength);
    }

    setGeneratedName(name);
    setValidation(validateName(name));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A202C' }}>Azure Resource Name Generator</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4A5568', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Settings style={{ width: '20px', height: '20px' }} />
            Settings
          </button>
        </div>

        {showSettings && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#F7FAFC', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Naming Pattern Settings</h2>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#2D3748', marginBottom: '5px' }}>
                Custom Pattern
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #CBD5E0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginTop: '5px',
                  }}
                  placeholder="Enter custom pattern"
                />
              </label>
              <p style={{ fontSize: '12px', color: '#718096' }}>
                Available placeholders: {'{resource_type}'}, {'{workload}'}, {'{environment}'}, {'{region}'}, {'{instance}'}, {'{department}'}, {'{business_unit}'}
              </p>
              {selectedResource && (
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#EBF8FF', borderRadius: '6px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#2B6CB0' }}>Resource-Specific Pattern</h3>
                  <p style={{ fontSize: '14px', color: '#2B6CB0' }}>
                    Recommended pattern: {selectedResource.namingPattern}
                  </p>
                  <p style={{ fontSize: '14px', color: '#2B6CB0' }}>
                    Max length: {selectedResource.maxLength} characters
                  </p>
                  <p style={{ fontSize: '14px', color: '#2B6CB0' }}>
                    Allowed characters: {selectedResource.allowedCharacters}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateName();
          }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#2D3748', marginBottom: '5px' }}>
              Resource Category
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #CBD5E0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginTop: '5px',
                }}
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
            <label style={{ display: 'block', fontSize: '14px', color: '#2D3748', marginBottom: '5px' }}>
              Resource Type
              <select
                name="resourceType"
                value={formData.resourceType}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #CBD5E0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginTop: '5px',
                }}
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
            <label style={{ display: 'block', fontSize: '14px', color: '#2D3748', marginBottom: '5px' }}>
              Workload/Application
              <input
                type="text"
                name="workload"
                value={formData.workload}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #CBD5E0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginTop: '5px',
                }}
                placeholder="e.g., myapp"
                required
              />
            </label>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#2D3748', marginBottom: '5px' }}>
              Environment
              <select
                name="environment"
                value={formData.environment}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #CBD5E0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginTop: '5px',
                }}
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
            <label style={{ display: 'block', fontSize: '14px', color: '#2D3748', marginBottom: '5px' }}>
              Region
              <select
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #CBD5E0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginTop: '5px',
                }}
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

          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#2D3748', marginBottom: '5px' }}>
              Instance (Optional)
              <input
                type="text"
                name="instance"
                value={formData.instance}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #CBD5E0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginTop: '5px',
                }}
                placeholder="e.g., 01"
              />
            </label>
          </div>

          {showDepartment && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#2D3748', marginBottom: '5px' }}>
                Department
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #CBD5E0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginTop: '5px',
                  }}
                  placeholder="e.g., finance"
                  required
                />
              </label>
            </div>
          )}

          {showBusinessUnit && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#2D3748', marginBottom: '5px' }}>
                Business Unit
                <input
                  type="text"
                  name="businessUnit"
                  value={formData.businessUnit}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #CBD5E0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    marginTop: '5px',
                  }}
                  placeholder="e.g., retail"
                  required
                />
              </label>
            </div>
          )}

          <div style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#0066CC',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Generate Name
            </button>
          </div>
        </form>

        {generatedName && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ padding: '15px', backgroundColor: '#F7FAFC', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Generated Resource Name:</h2>
              <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
                <code style={{ fontSize: '16px', fontFamily: 'monospace' }}>{generatedName}</code>
              </div>
            </div>

            {selectedResource && (
              <div style={{ padding: '15px', backgroundColor: '#EBF8FF', borderRadius: '8px', marginTop: '15px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2B6CB0', marginBottom: '10px' }}>
                  Resource Requirements:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                    <span style={{ color: '#2B6CB0' }}>Max Length:</span>
                    <span>{selectedResource.maxLength} characters</span>
                  </li>
                  <li style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                    <span style={{ color: '#2B6CB0' }}>Allowed Characters:</span>
                    <span>{selectedResource.allowedCharacters}</span>
                  </li>
                  <li style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#2B6CB0' }}>Note:</span>
                    <span>{selectedResource.description}</span>
                  </li>
                </ul>
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div style={{ padding: '15px', backgroundColor: '#FEFCBF', borderRadius: '8px', marginTop: '15px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#975A16', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertCircle style={{ width: '20px', height: '20px' }} />
                  Warnings:
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                  {validation.warnings.map((warning, index) => (
                    <li key={index} style={{ color: '#975A16' }}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.errors.length > 0 && (
              <div style={{ padding: '15px', backgroundColor: '#FED7D7', borderRadius: '8px', marginTop: '15px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#9B2C2C', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertCircle style={{ width: '20px', height: '20px' }} />
                  Errors:
                </h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
                  {validation.errors.map((error, index) => (
                    <li key={index} style={{ color: '#9B2C2C' }}>{error}</li>
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
