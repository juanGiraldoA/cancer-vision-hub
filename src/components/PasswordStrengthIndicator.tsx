import React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface Rule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const passwordRules: Rule[] = [
  {
    id: 'length',
    label: 'Al menos 8 caracteres',
    test: (password) => password.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Una letra mayúscula',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    label: 'Una letra minúscula',
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    label: 'Un número',
    test: (password) => /\d/.test(password),
  },
];

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <p className="text-sm font-medium text-muted-foreground">
        Requisitos de contraseña:
      </p>
      <div className="space-y-1">
        {passwordRules.map((rule) => {
          const isValid = rule.test(password);
          return (
            <div
              key={rule.id}
              className={`flex items-center text-sm ${
                isValid ? 'text-green-600' : 'text-muted-foreground'
              }`}
            >
              {isValid ? (
                <CheckIcon className="h-3 w-3 mr-2" />
              ) : (
                <XIcon className="h-3 w-3 mr-2" />
              )}
              {rule.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;