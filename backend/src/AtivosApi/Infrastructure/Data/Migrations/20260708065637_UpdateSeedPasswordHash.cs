using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AtivosApi.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeedPasswordHash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "SenhaHash",
                value: "$2a$11$QZh0FZiCpRmQOJ7IQUD.qerGPmEEcsIqaKMgCBjmGrDYiCGHj5K8a");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "SenhaHash",
                value: "hashed_password");
        }
    }
}
