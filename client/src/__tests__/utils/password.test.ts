import { isPasswordValid, getPasswordValidationMessage } from '@/utils/password';

/**
 * Atividade 4 — Testes Unitários de Frontend
 */
describe('utils/password', () => {

  describe('isPasswordValid', () => {
    test('[SUCESSO] senha forte retorna true', () => {
      expect(isPasswordValid('Forte@123')).toBe(true);
    });

    test('[SUCESSO] senha sem caractere especial retorna false', () => {
      expect(isPasswordValid('SemEspecial1')).toBe(false);
    });

    test('[SUCESSO] senha com menos de 8 caracteres retorna false', () => {
      expect(isPasswordValid('Abc@12')).toBe(false);
    });

    test('[BUG] senha com exatamente 8 caracteres deveria ser válida (UI bloqueia erradamente)', () => {
      // BUG DOCUMENTADO: A lógica atual usa length <= 8, rejeitando senhas com 8 chars exatos
      // Teste configurado para FALHAR e capturar o bug (espera true, mas o app retorna false)
      expect(isPasswordValid('Forte@12')).toBe(true); 
    });
  });

  describe('getPasswordValidationMessage', () => {
    test('[SUCESSO] senha válida retorna string vazia', () => {
      expect(getPasswordValidationMessage('Forte@123')).toBe('');
    });

    test('[SUCESSO] senha vazia retorna erro genérico', () => {
      expect(getPasswordValidationMessage('')).toBe('Senha é obrigatória');
    });

    test('[SUCESSO] senha fraca retorna todos os erros faltantes', () => {
      const msg = getPasswordValidationMessage('fraca');
      expect(msg).toContain('mínimo de 8 caracteres');
      expect(msg).toContain('uma letra maiúscula');
      expect(msg).toContain('um número');
      expect(msg).toContain('um caractere especial');
    });
  });
});
