const prometheus = require('prom-client');
const { Gauge } = prometheus;

const registry = new prometheus.Registry();

const metrics = {
    frametimeMs: new Gauge({ name: 'frametime_ms', help: 'Frame time in milliseconds', registers: [registry] }),
    framecomputetimeMs: new Gauge({ name: 'framecomputetime_ms', help: 'Frame compute time in milliseconds', registers: [registry] }),
    processUptime: new Gauge({ name: 'process_uptime', help: 'Process uptime in seconds', registers: [registry] }),
    buildVersion: new Gauge({ name: 'build_version', help: 'Build version', registers: [registry] }),
    clientsHuman: new Gauge({ name: 'clients_human', help: 'Number of players', registers: [registry] }),
};

module.exports = {
    registry,
    metrics,
}
