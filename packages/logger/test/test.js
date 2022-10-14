const { default: DLogger } = require("../dist/src/index");

const log = new DLogger("./")

log.warn("Warning you")

log.show("Showing you")

log.error("Erroring you")