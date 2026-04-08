import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Briefcase, MapPin, 
  Dog, Moon, Cigarette, ShieldAlert, BadgeCheck, FileText,
  DollarSign, Home, CheckCircle2, ChevronRight, ChevronLeft,
  Plus, Trash2
} from 'lucide-react';
import axios from 'axios';

// Types (replicated from shared types for simplicity)
interface PropertyInfo {
  type: string;
  address: {
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  proposedOccupants: number;
  dob: string;
  leaseLength: string;
  occupation: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  hasPets: boolean;
  worksAtNight: boolean;
  smokes: boolean;
  isFelon: boolean;
  isSection8: boolean;
  everConvicted: boolean;
  rent: number;
  securityDeposit: number;
  appFee: number;
  appFeeMethod: string;
  petFee: number;
  properties: PropertyInfo[];
  downPaymentAmount: string;
}

const initialData: ApplicationData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  proposedOccupants: 1,
  dob: '',
  leaseLength: '',
  occupation: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  hasPets: false,
  worksAtNight: false,
  smokes: false,
  isFelon: false,
  isSection8: false,
  everConvicted: false,
  rent: 1000,
  securityDeposit: 300,
  appFee: 70,
  appFeeMethod: 'Chime',
  petFee: 100,
  properties: [{ 
    type: 'Single Family', 
    address: { streetNumber: '106', streetName: 'S Front St', city: 'Wormleysburg', state: 'Pennsylvania', zipCode: '17043' } 
  }],
  downPaymentAmount: ''
};

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = 4;

  const updateField = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addProperty = () => {
    setFormData(prev => ({
      ...prev,
      properties: [...prev.properties, { 
        type: 'Single Family', 
        address: { streetNumber: '', streetName: '', city: '', state: '', zipCode: '' } 
      }]
    }));
  };

  const removeProperty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.filter((_, i) => i !== index)
    }));
  };

  const updateProperty = (index: number, field: string, value: any) => {
    const newProperties = [...formData.properties];
    if (field === 'type') {
      newProperties[index].type = value;
    } else {
      (newProperties[index].address as any)[field] = value;
    }
    setFormData(prev => ({ ...prev, properties: newProperties }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only allow submission on the final step
    if (step !== totalSteps) return;

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:3001/api/submit-application', formData);
      setIsSubmitted(true);
    } catch (error) {
      alert('Failed to submit application. Please check if the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (isSubmitted) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="form-card" 
          style={{ textAlign: 'center' }}
        >
          <CheckCircle2 size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h1>Application Submitted!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Thank you for your application. We will review it and get back to you soon via email or phone.</p>
          <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => window.location.reload()}>
            Start New Application
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Application Form</h1>
        <p style={{ color: 'var(--text-muted)' }}>Fill out the details below to apply for your new home.</p>
        
        {/* Progress Bar */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
          {[...Array(totalSteps)].map((_, i) => (
            <div 
              key={i} 
              style={{ 
                flex: 1, 
                height: '4px', 
                borderRadius: '2px',
                background: i + 1 <= step ? 'var(--primary)' : 'var(--border)',
                transition: 'background 0.3s ease'
              }} 
            />
          ))}
        </div>
      </header>

      <form 
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          // Prevent submission when pressing Enter, unless in a textarea
          if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="form-card"
            >
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={24} color="var(--primary)" /> Personal Information
              </h2>
              
              <div className="grid">
                <div className="form-group">
                  <label className="label">First Name</label>
                  <input 
                    className="input" 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={e => updateField('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Last Name</label>
                  <input 
                    className="input" 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={e => updateField('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid">
                <div className="form-group">
                  <label className="label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="email" 
                      className="input" 
                      style={{ paddingLeft: '2.5rem' }} 
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={e => updateField('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="tel" 
                      className="input" 
                      style={{ paddingLeft: '2.5rem' }} 
                      placeholder="(555) 000-0000" 
                      value={formData.phone}
                      onChange={e => updateField('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid">
                <div className="form-group">
                  <label className="label">Date of Birth</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="date" 
                      className="input" 
                      style={{ paddingLeft: '2.5rem' }} 
                      value={formData.dob}
                      onChange={e => updateField('dob', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Occupation</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      className="input" 
                      style={{ paddingLeft: '2.5rem' }} 
                      placeholder="Software Engineer" 
                      value={formData.occupation}
                      onChange={e => updateField('occupation', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid">
                <div className="form-group">
                  <label className="label">Proposed Occupants</label>
                  <input 
                    type="number" 
                    className="input" 
                    min="1" 
                    value={formData.proposedOccupants}
                    onChange={e => updateField('proposedOccupants', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Intended length of lease</label>
                  <input 
                    className="input" 
                    placeholder="12 months" 
                    value={formData.leaseLength}
                    onChange={e => updateField('leaseLength', e.target.value)}
                    required
                  />
                </div>
              </div>

              <h2 style={{ marginTop: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={24} color="var(--primary)" /> Current Address
              </h2>

              <div className="form-group">
                <label className="label">Address Line 1</label>
                <input 
                  className="input" 
                  placeholder="Street Address" 
                  value={formData.addressLine1}
                  onChange={e => updateField('addressLine1', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Address Line 2 (Optional)</label>
                <input 
                  className="input" 
                  placeholder="Apt, Suite, etc." 
                  value={formData.addressLine2}
                  onChange={e => updateField('addressLine2', e.target.value)}
                />
              </div>
              <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
                <div className="form-group">
                  <label className="label">City</label>
                  <input 
                    className="input" 
                    placeholder="City" 
                    value={formData.city}
                    onChange={e => updateField('city', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">State</label>
                  <input 
                    className="input" 
                    placeholder="State" 
                    value={formData.state}
                    onChange={e => updateField('state', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Zip Code</label>
                  <input 
                    className="input" 
                    placeholder="Zip" 
                    value={formData.zipCode}
                    onChange={e => updateField('zipCode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="form-card"
            >
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={24} color="var(--primary)" /> Questionnaire
              </h2>

              {[
                { label: 'Do you have pets?', field: 'hasPets', icon: <Dog size={20} /> },
                { label: 'Do you work at night?', field: 'worksAtNight', icon: <Moon size={20} /> },
                { label: 'Do you smoke?', field: 'smokes', icon: <Cigarette size={20} /> },
                { label: 'Are you a felon?', field: 'isFelon', icon: <ShieldAlert size={20} /> },
                { label: 'Are you on section 8?', field: 'isSection8', icon: <BadgeCheck size={20} /> },
                { label: 'Ever get convicted?', field: 'everConvicted', icon: <ShieldAlert size={20} /> },
              ].map((q) => (
                <div key={q.field} className="form-group" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: 'var(--primary)' }}>{q.icon}</span>
                      <span style={{ fontWeight: 600 }}>{q.label}</span>
                    </div>
                    <div className="choice-group" style={{ margin: 0 }}>
                      <div className="choice-item">
                        <input 
                          type="radio" 
                          id={`${q.field}-yes`} 
                          name={q.field} 
                          className="choice-input" 
                          checked={(formData as any)[q.field] === true}
                          onChange={() => updateField(q.field as any, true)}
                        />
                        <label htmlFor={`${q.field}-yes`} className="choice-label" style={{ padding: '0.4rem 1rem' }}>Yes</label>
                      </div>
                      <div className="choice-item">
                        <input 
                          type="radio" 
                          id={`${q.field}-no`} 
                          name={q.field} 
                          className="choice-input"
                          checked={(formData as any)[q.field] === false}
                          onChange={() => updateField(q.field as any, false)}
                        />
                        <label htmlFor={`${q.field}-no`} className="choice-label" style={{ padding: '0.4rem 1rem' }}>No</label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="form-card"
            >
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <DollarSign size={24} color="var(--primary)" /> Financial Details
              </h2>

              <div className="grid">
                <div className="form-group">
                  <label className="label">Rent ($)</label>
                  <input type="number" className="input" value={formData.rent} onChange={e => updateField('rent', parseInt(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="label">Security Deposit ($)</label>
                  <input type="number" className="input" value={formData.securityDeposit} onChange={e => updateField('securityDeposit', parseInt(e.target.value))} />
                </div>
              </div>

              <div className="grid">
                <div className="form-group">
                  <label className="label">App Fee ($)</label>
                  <input type="number" className="input" value={formData.appFee} onChange={e => updateField('appFee', parseInt(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="label">App Fee Method</label>
                  <select className="input" value={formData.appFeeMethod} onChange={e => updateField('appFeeMethod', e.target.value)}>
                    <option value="Chime">Chime</option>
                    <option value="Zelle">Zelle</option>
                    <option value="CashApp">CashApp</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="label">Pet Fee (per pet) ($)</label>
                <input type="number" className="input" value={formData.petFee} onChange={e => updateField('petFee', parseInt(e.target.value))} />
              </div>

              <h2 style={{ marginTop: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Home size={24} color="var(--primary)" /> Property Information
                </div>
                <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={addProperty}>
                  <Plus size={16} style={{ marginRight: '4px' }} /> Add Property
                </button>
              </h2>

              {formData.properties.map((prop, idx) => (
                <div key={idx} style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                  {idx > 0 && (
                    <button 
                      type="button" 
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }}
                      onClick={() => removeProperty(idx)}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div className="form-group">
                    <label className="label">Type of Property</label>
                    <select className="input" value={prop.type} onChange={e => updateProperty(idx, 'type', e.target.value)}>
                      <option>Single Family</option>
                      <option>Multi-Family</option>
                      <option>Vacation/Short Term</option>
                      <option>Land</option>
                      <option>Commercial</option>
                      <option>Self-Rental</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 3fr' }}>
                    <div className="form-group">
                      <label className="label">No.</label>
                      <input className="input" value={prop.address.streetNumber} onChange={e => updateProperty(idx, 'streetNumber', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="label">Street</label>
                      <input className="input" value={prop.address.streetName} onChange={e => updateProperty(idx, 'streetName', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
                    <div className="form-group">
                      <label className="label">City</label>
                      <input className="input" value={prop.address.city} onChange={e => updateProperty(idx, 'city', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="label">State</label>
                      <input className="input" value={prop.address.state} onChange={e => updateProperty(idx, 'state', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="label">Zip</label>
                      <input className="input" value={prop.address.zipCode} onChange={e => updateProperty(idx, 'zipCode', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="form-card"
            >
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BadgeCheck size={24} color="var(--primary)" /> Review & Submit
              </h2>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <p style={{ marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>Final Question: If you are asked to make a down payment to secure the house today and take it off the market, How much will you be able to pay?</p>
                <textarea 
                  className="input" 
                  rows={3} 
                  placeholder="Answer below..."
                  value={formData.downPaymentAmount}
                  onChange={e => updateField('downPaymentAmount', e.target.value)}
                  style={{ resize: 'none' }}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Personal Info Summary */}
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personal Information</h3>
                    <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  </div>
                  <p><strong>{formData.firstName} {formData.lastName}</strong></p>
                  <p style={{ fontSize: '0.9rem' }}>{formData.email} | {formData.phone}</p>
                  <p style={{ fontSize: '0.9rem' }}>Occupants: {formData.proposedOccupants} | DOB: {formData.dob}</p>
                </div>

                {/* Questionnaire Summary */}
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Questionnaire</h3>
                    <button type="button" onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <p>Pets: {formData.hasPets ? '✅' : '❌'}</p>
                    <p>Night Work: {formData.worksAtNight ? '✅' : '❌'}</p>
                    <p>Smoke: {formData.smokes ? '✅' : '❌'}</p>
                    <p>Felon: {formData.isFelon ? '✅' : '❌'}</p>
                    <p>Section 8: {formData.isSection8 ? '✅' : '❌'}</p>
                    <p>Convicted: {formData.everConvicted ? '✅' : '❌'}</p>
                  </div>
                </div>

                {/* Financials & Properties Summary */}
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financials & Properties</h3>
                    <button type="button" onClick={() => setStep(3)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  </div>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Rent: ${formData.rent} | Deposit: ${formData.securityDeposit} | App Fee: ${formData.appFee} ({formData.appFeeMethod})</p>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                    {formData.properties.map((p, i) => (
                      <p key={i} style={{ fontSize: '0.85rem' }}>🏠 {p.type}: {p.address.streetNumber} {p.address.streetName}, {p.address.city}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', background: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--primary)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Please review all information carefully. Click "Edit" to make changes or "Submit" to send your application.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          {step > 1 && (
            <button type="button" className="btn btn-outline" onClick={prevStep} style={{ flex: 1 }}>
              <ChevronLeft size={20} style={{ marginRight: '8px' }} /> Previous
            </button>
          )}
          {step < totalSteps ? (
            <button type="button" className="btn btn-primary" onClick={nextStep} style={{ flex: 1, marginLeft: step === 1 ? 'auto' : '0' }}>
              Next Step <ChevronRight size={20} style={{ marginLeft: '8px' }} />
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ flex: 1 }}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default App;
