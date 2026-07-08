using FluentValidation;
using AtivosApi.Domain.DTOs;

namespace AtivosApi.Domain.Validators;

public class EmprestarAtivoRequestValidator : AbstractValidator<EmprestarAtivoRequest>
{
    public EmprestarAtivoRequestValidator()
    {
        RuleFor(x => x.UsuarioSolicitanteId)
            .NotEmpty().WithMessage("O usuário solicitante é obrigatório.");

        RuleFor(x => x.SetorDestino)
            .NotEmpty().WithMessage("O setor de destino é obrigatório.")
            .MaximumLength(50).WithMessage("O setor deve ter no máximo 50 caracteres.");

        RuleFor(x => x.Observacoes)
            .MaximumLength(500).WithMessage("As observações devem ter no máximo 500 caracteres.");
    }
}
