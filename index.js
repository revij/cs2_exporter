const { connect } = require('@unyxos/working-rcon');
const validator = require('express-joi-validation').createValidator({});
const express = require('express');
const app = express();

const { metricsParamsSchema } = require('./utils/joi-schema');
const { metrics, registry } = require('./utils/metrics');
const logger = require('./utils/logging');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/utils/homepage.html');
});

app.get('/metrics', validator.query(metricsParamsSchema), async (req, res) => {
    const { ip, port, password } = req.query;

    try {
        const client = await connect(ip, port, password, 5 * 1000);
        const statusJsonResponse = await client.command('status_json');
        await client.disconnect();

        const statusJson = JSON.parse(statusJsonResponse);

        metrics.frametimeMs.set(statusJson.frametime_ms || 0);
        metrics.framecomputetimeMs.set(statusJson.framecomputetime_ms || 0);
        metrics.processUptime.set(statusJson.process_uptime || 0);
        metrics.buildVersion.set(statusJson.build_version || 0);
        metrics.clientsHuman.set(statusJson.server.clients_human || 0);

    } catch (err) {
        logger.error({ step: 'FETCH_METRICS', err: err.message }, 'error while fetching metrics from server');
    } finally {
        res.set('Content-Type', registry.contentType);
        res.end(registry.metrics());
    }
});

const port = process.env.HTTP_PORT || 9591;
app.listen(port, () => {
    logger.info(`Metrics server listening on port ${port}`);
});

process.on('uncaughtException', (err) => {
    logger.error({ step: 'UNCAUGHT_EXCEPTION', err: err.message }, 'uncaught exception');
});
