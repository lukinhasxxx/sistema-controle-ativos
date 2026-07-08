using FluentValidation;
using AtivosApi.Domain.DTOs;

namespace AtivosApi.Domain.Validators;

public class EditarAtivoRequestValidator : AbstractValidator<EditarAtivoRequest>
{
    public EditarAtivoRequestValidator()
    {
        RuleFor(x => x.Equipamento)
            .NotEmpty().WithMessage("A descrição do equipamento é obrigatória.")
            .MaximumLength(100).WithMessage("A descrição deve ter no máximo 100 caracteres.");

        RuleFor(x => x.Categoria)
            .NotEmpty().WithMessage("A categoria é obrigatória.")
            .MaximumLength(50).WithMessage("A categoria deve ter no máximo 50 caracteres.");
    }
}
