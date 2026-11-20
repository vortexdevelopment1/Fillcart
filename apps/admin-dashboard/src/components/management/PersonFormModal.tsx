import React, { useState, useEffect } from 'react';
import { CustomSelect } from '../common/CustomSelect';
import { X } from 'lucide-react';
import { ManagementVendor, ManagementRider } from '../../data/mockManagementData';

interface PersonFormModalProps {
  isOpen: boolean;
  type: 'vendor' | 'rider';
  item: ManagementVendor | ManagementRider | null; // null for Add, populated for Edit
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const VENDOR_CATEGORIES = [
  'Grocery',
  'Dairy',
  'Pharmacy',
  'Fresh Produce',
  'Bakery',
  'Beverages & Snacks',
  'Sweets & Snacks',
  'Organic Store',
];

const VEHICLE_TYPES = [
  'Motorcycle',
  'Scooter',
  'Electric',
  'Bicycle',
  'On foot',
] as const;

export const PersonFormModal: React.FC<PersonFormModalProps> = ({
  isOpen,
  type,
  item,
  onClose,
  onSubmit,
}) => {
  // Vendor specific fields
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState(VENDOR_CATEGORIES[0]);
  const [shopAddress, setShopAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [commissionPct, setCommissionPct] = useState(8);

  // Rider specific fields
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [vehicleType, setVehicleType] = useState<typeof VEHICLE_TYPES[number]>('Motorcycle');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Shared fields
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    if (item) {
      if (type === 'vendor') {
        const v = item as ManagementVendor;
        setStoreName(v.storeName || '');
        setOwnerName(v.ownerName || '');
        setCategory(v.businessCategory || VENDOR_CATEGORIES[0]);
        setShopAddress(v.shopAddress || '');
        setGstin(v.gstin || '');
        setCommissionPct(v.commissionPct || 8);
        setPhone(v.phone || '');
        setEmail(v.email || '');
        setCity(v.city || '');
      } else {
        const r = item as ManagementRider;
        setName(r.name || '');
        setAddress(r.address || '');
        setVehicleType(r.vehicleType || 'Motorcycle');
        setVehicleNumber(r.vehicleNumber === '-' ? '' : r.vehicleNumber || '');
        setEmergencyName(r.emergencyContact?.name || '');
        setEmergencyRelation(r.emergencyContact?.relation || 'Spouse');
        setEmergencyPhone(r.emergencyContact?.phone || '');
        setPhone(r.phone || '');
        setEmail(r.email || '');
        setCity(r.city || '');
      }
    } else {
      // Defaults for Add
      setStoreName('');
      setOwnerName('');
      setCategory(VENDOR_CATEGORIES[0]);
      setShopAddress('');
      setGstin('');
      setCommissionPct(8);

      setName('');
      setAddress('');
      setVehicleType('Motorcycle');
      setVehicleNumber('');
      setEmergencyName('');
      setEmergencyRelation('Spouse');
      setEmergencyPhone('');

      setPhone('');
      setEmail('');
      setCity('Indore');
    }

    setErrors({});

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, item, type, onClose]);

  if (!isOpen) return null;

  const isMotorVehicle =
    vehicleType === 'Motorcycle' || vehicleType === 'Scooter' || vehicleType === 'Electric';

  // Real-time field validation
  const validateForm = () => {
    const errs: Record<string, string> = {};

    // Phone: must be 10 digits
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phone = 'Phone number is required';
    } else if (cleanPhone.length !== 10) {
      errs.phone = 'Enter valid 10-digit mobile number';
    }

    // Email
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    // City
    if (!city.trim()) {
      errs.city = 'City is required';
    }

    if (type === 'vendor') {
      if (!storeName.trim()) errs.storeName = 'Store name is required';
      if (!ownerName.trim()) errs.ownerName = 'Owner name is required';
      if (!shopAddress.trim()) errs.shopAddress = 'Shop address is required';
      if (gstin.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(gstin.trim())) {
        errs.gstin = 'Invalid 15-character GSTIN format';
      }
    } else {
      if (!name.trim()) errs.name = 'Full name is required';
      if (!address.trim()) errs.address = 'Residential address is required';
      if (isMotorVehicle && !vehicleNumber.trim()) {
        errs.vehicleNumber = 'Registration number is required for motor vehicle';
      }
      if (!emergencyName.trim()) errs.emergencyName = 'Contact name required';
      const cleanEmPhone = emergencyPhone.replace(/\D/g, '');
      if (!cleanEmPhone || cleanEmPhone.length !== 10) {
        errs.emergencyPhone = '10-digit phone required';
      }
    }

    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (type === 'vendor') {
      onSubmit({
        storeName: storeName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        businessCategory: category,
        city: city.trim(),
        shopAddress: shopAddress.trim(),
        gstin: gstin.trim() || undefined,
        commissionPct: Number(commissionPct) || 8,
      });
    } else {
      onSubmit({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        address: address.trim(),
        vehicleType,
        vehicleNumber: isMotorVehicle ? vehicleNumber.trim() : '-',
        emergencyContact: {
          name: emergencyName.trim(),
          relation: emergencyRelation.trim() || 'Spouse',
          phone: emergencyPhone.trim(),
        },
      });
    }
  };

  const isFormValid = Object.keys(validateForm()).length === 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 transition-all duration-200"
      style={{
        backgroundColor: 'rgba(18, 55, 71, 0.35)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      aria-hidden="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[calc(100vw-24px)] min-[700px]:w-[min(740px,calc(100vw-32px))] max-h-[calc(100vh-24px)] min-[700px]:max-h-[min(650px,calc(100vh-48px))] bg-white rounded-[24px] shadow-[0_24px_60px_rgba(18, 55, 71, 0.25)] flex flex-col overflow-hidden relative select-none"
        role="dialog"
        aria-modal="true"
        aria-label={`${item ? 'Edit' : 'Add'} ${type === 'vendor' ? 'Vendor' : 'Rider'}`}
      >
        {/* Header */}
        <div className="p-[18px_24px] border-b border-primary/10 flex items-center justify-between flex-shrink-0 bg-white">
          <h3 className="font-heading text-[18px] text-ink font-normal leading-tight">
            {item ? 'Edit Details' : `+ Add ${type === 'vendor' ? 'Vendor' : 'Rider'}`}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral flex items-center justify-center text-ink/55 hover:text-ink transition-colors focus:ring-2 focus:ring-secondary ml-2 flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-ink" />
          </button>
        </div>

        {/* Form Body: 2 columns, 1 column < 700px */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 min-[700px]:grid-cols-2 gap-4 text-xs font-sans">
            {type === 'vendor' ? (
              <>
                <div>
                  <label className="text-ink/75 font-medium block mb-1">Store Name *</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Royal Kirana"
                    className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink"
                  />
                  {errors.storeName && (
                    <span className="text-[10px] text-ink mt-0.5 block underline font-medium">
                      {errors.storeName}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-ink/75 font-medium block mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Rajesh Gupta"
                    className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink"
                  />
                  {errors.ownerName && (
                    <span className="text-[10px] text-ink mt-0.5 block underline font-medium">
                      {errors.ownerName}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-ink/75 font-medium block mb-1">Business Category *</label>
                  <CustomSelect
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink bg-white"
                  >
                    {VENDOR_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </CustomSelect>
                </div>

                <div>
                  <label className="text-ink/75 font-medium block mb-1">Commission % *</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={commissionPct}
                    onChange={(e) => setCommissionPct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink"
                  />
                </div>

                <div className="min-[700px]:col-span-2">
                  <label className="text-ink/75 font-medium block mb-1">Full Shop Address *</label>
                  <input
                    type="text"
                    required
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    placeholder="Shop number, market, landmark, locality..."
                    className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink"
                  />
                  {errors.shopAddress && (
                    <span className="text-[10px] text-ink mt-0.5 block underline font-medium">
                      {errors.shopAddress}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-ink/75 font-medium block mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="e.g. 23AABCR1234F1Z8"
                    className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink uppercase"
                  />
                  {errors.gstin ? (
                    <span className="text-[10px] text-ink mt-0.5 block underline font-medium">
                      {errors.gstin}
                    </span>
                  ) : (
                    <span className="text-[10px] text-ink/50 block mt-0.5">
                      Optional for eligible unregistered sellers
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-ink/75 font-medium block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink"
                  />
                  {errors.name && (
                    <span className="text-[10px] text-ink mt-0.5 block underline font-medium">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-ink/75 font-medium block mb-1">Vehicle Type *</label>
                  <CustomSelect
                    value={vehicleType}
                    onChange={(e) =>
                      setVehicleType(e.target.value as typeof VEHICLE_TYPES[number])
                    }
                    className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink bg-white"
                  >
                    {VEHICLE_TYPES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </CustomSelect>
                </div>

                <div>
                  <label className="text-ink/75 font-medium block mb-1">
                    Vehicle Number {isMotorVehicle ? '*' : '(Disabled)'}
                  </label>
                  <input
                    type="text"
                    disabled={!isMotorVehicle}
                    value={isMotorVehicle ? vehicleNumber : '-'}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="e.g. MP09 AB 1234"
                    className={`w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink uppercase ${
                      !isMotorVehicle ? 'bg-neutral text-ink/40 cursor-not-allowed' : ''
                    }`}
                  />
                  {errors.vehicleNumber && (
                    <span className="text-[10px] text-ink mt-0.5 block underline font-medium">
                      {errors.vehicleNumber}
                    </span>
                  )}
                </div>

                <div className="min-[700px]:col-span-2">
                  <label className="text-ink/75 font-medium block mb-1">Residential Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number, colony, landmark..."
                    className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink"
                  />
                  {errors.address && (
                    <span className="text-[10px] text-ink mt-0.5 block underline font-medium">
                      {errors.address}
                    </span>
                  )}
                </div>

                <div className="min-[700px]:col-span-2 p-3 rounded-[12px] bg-neutral border border-primary/10 space-y-2">
                  <span className="font-medium text-ink block">Emergency Contact *</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Contact Name"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-[8px] border border-primary/15 text-xs text-ink"
                      />
                      {errors.emergencyName && (
                        <span className="text-[10px] text-ink mt-0.5 block underline">
                          {errors.emergencyName}
                        </span>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Relation (e.g. Spouse)"
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-[8px] border border-primary/15 text-xs text-ink"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="10-digit Phone"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-[8px] border border-primary/15 text-xs text-ink"
                      />
                      {errors.emergencyPhone && (
                        <span className="text-[10px] text-ink mt-0.5 block underline">
                          {errors.emergencyPhone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Shared Contact & City Fields */}
            <div>
              <label className="text-ink/75 font-medium block mb-1">Mobile Phone (10 digits) *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9826012345"
                className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink"
              />
              {errors.phone && (
                <span className="text-[10px] text-ink mt-0.5 block underline font-medium">
                  {errors.phone}
                </span>
              )}
            </div>

            <div>
              <label className="text-ink/75 font-medium block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@fillcart.in"
                className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink"
              />
              {errors.email && (
                <span className="text-[10px] text-ink mt-0.5 block underline font-medium">
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <label className="text-ink/75 font-medium block mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Indore, Bhopal..."
                className="w-full px-3 py-2 rounded-[10px] border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary text-ink"
              />
              {errors.city && (
                <span className="text-[10px] text-ink mt-0.5 block underline font-medium">
                  {errors.city}
                </span>
              )}
            </div>
          </div>

          {!item && (
            <div className="p-2.5 rounded-[10px] bg-neutral border border-primary/10 text-[11px] text-primary">
              New accounts automatically start as <strong>Pending Verification</strong> and{' '}
              <strong>Inactive</strong>, and are routed to Document Verification.
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-primary/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-sans bg-white border border-primary/15 text-ink hover:bg-neutral"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-5 py-2 rounded-full text-xs font-sans bg-primary text-white font-medium hover:opacity-90 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed shadow-xs"
            >
              {item ? 'Save Changes' : `Add ${type === 'vendor' ? 'Vendor' : 'Rider'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
