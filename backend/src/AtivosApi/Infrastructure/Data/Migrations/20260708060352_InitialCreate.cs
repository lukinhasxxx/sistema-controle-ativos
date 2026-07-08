using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtivosApi.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    NomeCompleto = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Cpf = table.Column<string>(type: "TEXT", maxLength: 11, nullable: false),
                    SenhaHash = table.Column<string>(type: "TEXT", nullable: false),
                    Setor = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ativos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    CodigoIdentificacao = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Equipamento = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Categoria = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    IsExcluido = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    UsuarioCadastroId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ativos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ativos_Usuarios_UsuarioCadastroId",
                        column: x => x.UsuarioCadastroId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Emprestimos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DataEmprestimo = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DataDevolucao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SetorDestino = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Observacoes = table.Column<string>(type: "TEXT", nullable: true),
                    AtivoId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UsuarioSolicitanteId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emprestimos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Emprestimos_Ativos_AtivoId",
                        column: x => x.AtivoId,
                        principalTable: "Ativos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Emprestimos_Usuarios_UsuarioSolicitanteId",
                        column: x => x.UsuarioSolicitanteId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Cpf", "Email", "NomeCompleto", "SenhaHash", "Setor" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), "00000000000", "admin@cejam.org.br", "Administrador CEJAM", "hashed_password", "TI" });

            migrationBuilder.CreateIndex(
                name: "IX_Ativos_CodigoIdentificacao",
                table: "Ativos",
                column: "CodigoIdentificacao",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ativos_UsuarioCadastroId",
                table: "Ativos",
                column: "UsuarioCadastroId");

            migrationBuilder.CreateIndex(
                name: "IX_Emprestimos_AtivoId",
                table: "Emprestimos",
                column: "AtivoId");

            migrationBuilder.CreateIndex(
                name: "IX_Emprestimos_UsuarioSolicitanteId",
                table: "Emprestimos",
                column: "UsuarioSolicitanteId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Cpf",
                table: "Usuarios",
                column: "Cpf",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Emprestimos");

            migrationBuilder.DropTable(
                name: "Ativos");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
