import React from 'react';
import { useAsync } from '@/hooks/useAsync';
import { getCloseEndedChoiceTypes } from '@/services/choice.service';


const CloseTypeContext = React.createContext({});

function CloseEndedChoiceTypeProvider({ children }: { children: React.ReactNode }) {
  const { data: closeEndedTypes, loading } = useAsync(getCloseEndedChoiceTypes);

  return (
    <CloseTypeContext.Provider value={{ variants: (closeEndedTypes as any)?.variants || [], loading }}>
      {children}
    </CloseTypeContext.Provider>
  )
}

export default CloseEndedChoiceTypeProvider;

export function useCloseEndedChoiceType() {
  const data = React.useContext(CloseTypeContext);

  if (!data) {
    throw new Error("useCloseEndedChoiceType must be wrapped inside provider");
  }

  return data;
}