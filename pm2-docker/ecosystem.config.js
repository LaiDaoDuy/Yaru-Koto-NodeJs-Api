module.exports = {
    apps: [{
        name: "api",
        script: "/usr/src/app/dist/src/index.js",
        exec_mode: "fork",
        watch: ["/usr/src/app/dist"],

        log_date_format: "YYYY-MM-DD HH:mm Z",
        error_file: "/usr/src/app/logs/api-error.log",
        out_file:"/usr/src/app/logs/api-out.log"
    }]
}