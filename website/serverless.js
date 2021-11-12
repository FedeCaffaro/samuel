const { Component } = require('@serverless/core')

class Deploy extends Component {
  async default(inputs = { env: 'dev', name: 'dizzydemons' }) {
    const template = await this.load('@serverless/template', inputs.env)
    const output = await template({
      template: {
        name: inputs.name,
        nextApp: {
          component: '@sls-next/serverless-component@1.18.1-alpha.2',
          inputs: {
            bucketName: `dizzydemons-web-${inputs.env}`,
          },
        },
      },
    })

    return output
  }
}

module.exports = Deploy
