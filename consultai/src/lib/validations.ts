import { z } from 'zod';

// Schema de validação para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
  senha: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

// Schema de validação para cadastro
export const cadastroSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
  senha: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
    ),
  confirmarSenha: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});

// Schema de validação para mensagem do chat
export const mensagemSchema = z.object({
  texto: z
    .string()
    .min(1, 'Mensagem não pode estar vazia')
    .max(1000, 'Mensagem muito longa (máximo 1000 caracteres)'),
});

// Tipos TypeScript inferidos dos schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type CadastroInput = z.infer<typeof cadastroSchema>;
export type MensagemInput = z.infer<typeof mensagemSchema>;
