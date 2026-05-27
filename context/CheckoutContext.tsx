import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CheckoutState, CustomerDetails, DeliveryAddress } from '@/types/checkout';
import { loadCheckout, saveCheckout, getDefaultCheckout } from '@/services/api/checkoutService';
import { useAuth } from '@/context/AuthContext';
import { loadAddresses, type SavedAddress } from '@/data/mock/accountData';

interface CheckoutContextValue {
  state: CheckoutState;
  setCustomer: (d: CustomerDetails) => void;
  setAddress: (a: DeliveryAddress) => void;
  setShippingMethod: (id: string) => void;
  setPaymentMethod: (id: string) => void;
  setAgreedToTerms: (v: boolean) => void;
  setSelectedAddressId: (id: string) => void;
  resetCheckout: () => void;
  /** Saved addresses — only populated for logged-in users */
  savedAddresses: SavedAddress[];
  /** Apply a saved address to both contact + address fields */
  applySavedAddress: (addr: SavedAddress) => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [state, setState] = useState<CheckoutState>(loadCheckout);

  // Load saved addresses only for logged-in users
  const savedAddresses = isLoggedIn ? loadAddresses() : [];

  // On first mount for logged-in user, prefill from default address if checkout is blank
  useEffect(() => {
    if (!isLoggedIn || savedAddresses.length === 0) return;
    // Only prefill if checkout contact is empty (fresh session)
    if (state.customer.firstName || state.customer.email) return;

    const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
    if (defaultAddr) {
      setState(s => ({
        ...s,
        selectedAddressId: defaultAddr.id,
        customer: {
          firstName: defaultAddr.firstName,
          lastName: defaultAddr.lastName,
          email: defaultAddr.email,
          phone: defaultAddr.phone,
        },
        address: {
          fullName: `${defaultAddr.firstName} ${defaultAddr.lastName}`,
          email: defaultAddr.email,
          phone: defaultAddr.phone,
          area: defaultAddr.area,
          block: defaultAddr.block,
          street: defaultAddr.street,
          building: defaultAddr.building,
          floor: defaultAddr.floor || '',
          flat: defaultAddr.flatOffice || '',
          notes: defaultAddr.additionalNotes || '',
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => { saveCheckout(state); }, [state]);

  const setCustomer = useCallback((customer: CustomerDetails) =>
    setState(s => ({ ...s, customer })), []);

  const setAddress = useCallback((address: DeliveryAddress) =>
    setState(s => ({ ...s, address })), []);

  const setShippingMethod = useCallback((shippingMethodId: string) =>
    setState(s => ({ ...s, shippingMethodId })), []);

  const setPaymentMethod = useCallback((paymentMethodId: string) =>
    setState(s => ({ ...s, paymentMethodId })), []);

  const setAgreedToTerms = useCallback((agreedToTerms: boolean) =>
    setState(s => ({ ...s, agreedToTerms })), []);

  const setSelectedAddressId = useCallback((selectedAddressId: string) =>
    setState(s => ({ ...s, selectedAddressId })), []);

  const applySavedAddress = useCallback((addr: SavedAddress) => {
    setState(s => ({
      ...s,
      selectedAddressId: addr.id,
      customer: {
        firstName: addr.firstName,
        lastName: addr.lastName,
        email: addr.email,
        phone: addr.phone,
      },
      address: {
        fullName: `${addr.firstName} ${addr.lastName}`,
        email: addr.email,
        phone: addr.phone,
        area: addr.area,
        block: addr.block,
        street: addr.street,
        building: addr.building,
        floor: addr.floor || '',
        flat: addr.flatOffice || '',
        notes: addr.additionalNotes || '',
      },
    }));
  }, []);

  const resetCheckout = useCallback(() => setState(getDefaultCheckout()), []);

  return (
    <CheckoutContext.Provider value={{ state, setCustomer, setAddress, setShippingMethod, setPaymentMethod, setAgreedToTerms, setSelectedAddressId, resetCheckout, savedAddresses, applySavedAddress }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
};
