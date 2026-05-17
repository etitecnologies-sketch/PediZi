module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // nova funcionalidade
        'fix',      // correção de bug
        'docs',     // documentação
        'style',    // formatação
        'refactor', // refatoração
        'test',     // testes
        'chore',    // tarefas de manutenção
        'perf',     // performance
        'ci',       // CI/CD
        'revert',   // reverter commit
        'build',    // build do sistema
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 100],
  },
}
