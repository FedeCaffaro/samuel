const { Component } = require('@serverless/core')

class Deploy extends Component {
  async default(inputs = { env: 'prod', name: 'samot-website' }) {
    const template = await this.load('@serverless/template', "prod")
    const output = await template({
      template: {
        name: inputs.name,
        nextApp: {
          component: '@sls-next/serverless-component',
          inputs: {
            bucketName: `samot-website2-prod`,
          },
        },
      },
    })

    return output
  }
}

module.exports = Deploy
