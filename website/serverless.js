const { Component } = require('@serverless/core')

class Deploy extends Component {
  async default(inputs = { env: 'dev', name: 'samot-website' }) {
    const template = await this.load('@serverless/template', inputs.env)
    const output = await template({
      template: {
        name: inputs.name,
        nextApp: {
          component: '@sls-next/serverless-component@1.18.1-alpha.2',
          inputs: {
            bucketName: `samot-website-${inputs.env}`,
          },
        },
      },
    })

    return output
  }
}

module.exports = Deploy
