using FluentValidation;
using AtivosApi.Domain.DTOs;

namespace AtivosApi.Domain.Validators;

public class CadastrarUsuarioRequestValidator : AbstractValidator<CadastrarUsuarioRequest>
{
    public CadastrarUsuarioRequestValidator()
    {
        RuleFor(x => x.NomeCompleto)
            .NotEmpty().WithMessage("O nome completo é obrigatório.")
            .MinimumLength(3).WithMessage("O nome deve ter no mínimo 3 caracteres.")
            .MaximumLength(100).WithMessage("O nome deve ter no máximo 100 caracteres.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("O e-mail é obrigatório.")
            .EmailAddress().WithMessage("O formato do e-mail é inválido.");

        RuleFor(x => x.Cpf)
            .NotEmpty().WithMessage("O CPF é obrigatório.")
            .Length(11).WithMessage("O CPF deve ter exatamente 11 dígitos.")
            .Matches("^[0-9]+$").WithMessage("O CPF deve conter apenas números.");

        RuleFor(x => x.Senha)
            .NotEmpty().WithMessage("A senha é obrigatória.")
            .MinimumLength(6).WithMessage("A senha deve ter no mínimo 6 caracteres.");

        RuleFor(x => x.Setor)
            .NotEmpty().WithMessage("O setor é obrigatório.")
            .MaximumLength(50).WithMessage("O setor deve ter no máximo 50 caracteres.");
    }
}
