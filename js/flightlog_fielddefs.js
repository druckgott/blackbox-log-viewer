"use strict";

function makeReadOnly(x) {
        // Make read-only if browser supports it:
        if (Object.freeze) {
                return Object.freeze(x);
        }

        // Otherwise a no-op
        return x;
}

var
        FlightLogEvent = makeReadOnly({
                SYNC_BEEP: 0,

                AUTOTUNE_CYCLE_START: 10,
                AUTOTUNE_CYCLE_RESULT: 11,
                AUTOTUNE_TARGETS: 12,
                INFLIGHT_ADJUSTMENT: 13,
                LOGGING_RESUME: 14,

                GTUNE_CYCLE_RESULT: 20,
                FLIGHT_MODE: 30, // New Event type
                TWITCH_TEST: 40, // Feature for latency testing
                CUSTOM: 250, // Virtual Event Code - Never part of Log File.
                CUSTOM_BLANK: 251, // Virtual Event Code - Never part of Log File. - No line shown
                LOG_END: 255
        }),

        // Add a general axis index.
        AXIS = makeReadOnly({
                ROLL: 0,
                PITCH: 1,
                YAW: 2
        }),


        FLIGHT_LOG_FLIGHT_MODE_NAME = makeReadOnly([
                "ARM",
                "ANGLE",
                "HORIZON",
                "NAV ALTHOLD",
                "HEADING HOLD",
                "HEADFREE",
                "HEAD ADJ",
                "CAMSTAB",
                "NAV RTH",
                "NAV POSHOLD",
                "MANUAL",
                "BEEPER",
                "LEDS OFF",
                "LLIGHTS",
                "NAV LAUNCH",
                "OSD OFF",
                "TELEMETRY",
                "BLACKBOX",
                "FAILSAFE",
                "NAV WP",
                "AIRMODE",
                "HOME RESET",
                "GCS NAV",
                "KILLSWITCH",
                "SURFACE",
                "FLAPERON",
                "TURN ASSIST",
                "SERVO AUTOTRIM",
                "AUTO TUNE",
                "CAMERA 1",
                "CAMERA 2",
                "CAMERA 3",
                "OSD ALT1",
                "OSD ALT2",
                "OSD ALT3",
                "NAV COURSE HOLD",
                "MC BRAKING",
                "USER 1",
                "USER 2",
                "FPV ANGLE MIX", // FPV Angle Mix
                "LOITER CHANGE", // Loiter direction change
                "MSP RC OVERRIDE", // MSP RC Override
                "PREARM",
                "TURTLE",
                "NAV CRUISE",
                "AUTOLEVEL",
                "WP PLANNER",
                "SOARING"
        ]),

        PID_CONTROLLER_TYPE = ([
                'UNUSED',
                'MWREWRITE',
                'LUXFLOAT'
        ]),

        PID_DELTA_TYPE = makeReadOnly([
                'ERROR',
                'MEASUREMENT'
        ]),

        OFF_ON = makeReadOnly([
                "OFF",
                "ON"
        ]),

        FAST_PROTOCOL = makeReadOnly([
                "STANDARD",
                "ONESHOT125",
                "MULTISHOT",
                "BRUSHED",
                "DSHOT150",
                "DSHOT300",
                "DSHOT600"
        ]),

        MOTOR_SYNC = makeReadOnly([
                "SYNCED",
                "UNSYNCED"
        ]),

        SERIALRX_PROVIDER = makeReadOnly([
                "SPEK1024", "SPEK2048", "SBUS", "SUMD", "SUMH", "XB-B", "XB-B-RJ01", "IBUS", "JETIEXBUS", "CRSF", "FPORT", "SBUS_FAST"
        ]),

        FILTER_TYPE = makeReadOnly([
                "PT1",
                "BIQUAD",
                "FIR"
        ]),

        DEBUG_MODE = makeReadOnly([
                "NONE",
                "GYRO",
                "AGL",
                "FLOW_RAW",
                "FLOW",
                "SBUS",
                "FPORT",
                "ALWAYS",
                "SAG_COMP_VOLTAGE",
                "VIBE",
                "CRUISE",
                "REM_FLIGHT_TIME",
                "SMARTAUDIO",
                "ACC",
                "ERPM",
                "RPM_FILTER",
                "RPM_FREQ",
                "NAV_YAW",
                "DYNAMIC_FILTER",
                "DYNAMIC_FILTER_FREQUENCY",
                "IRLOCK",
                "KALMAN_GAIN",
                "PID_MEASUREMENT",
                "SPM_CELLS",
                "SPM_VS600",
                "SPM_VARIO",
                "PCF8574",
                "DYN_GYRO_LPF",
                "AUTOLEVEL",
                "IMU2",
                "ALTITUDE",
                "SMITH_PREDICTOR",
                "AUTOTRIM",
                "AUTOTUNE",
                "RATE_DYNAMICS",
                "LANDING"
        ]),

        SUPER_EXPO_YAW = makeReadOnly([
                "OFF",
                "ON",
                "ALWAYS"
        ]),

        DTERM_DIFFERENTIATOR = makeReadOnly([
                "STANDARD",
                "ENHANCED"
        ]),

        GYRO_LPF = makeReadOnly([
                "OFF",
                "188HZ",
                "98HZ",
                "42HZ",
                "20HZ",
                "10HZ",
                "5HZ",
                "EXPERIMENTAL"
        ]),

        ACC_HARDWARE = makeReadOnly([
                "AUTO",
                "NONE",
                "ADXL345",
                "MPU6050",
                "MMA8452",
                "BMA280",
                "LSM303DLHC",
                "MPU6000",
                "MPU6500",
                "FAKE"
        ]),

        BARO_HARDWARE = makeReadOnly([
                "AUTO",
                "NONE",
                "BMP085",
                "MS5611",
                "BMP280"
        ]),

        MAG_HARDWARE = makeReadOnly([
                "AUTO",
                "NONE",
                "HMC5883",
                "AK8975",
                "AK8963"
        ]),

        FLIGHT_LOG_FLIGHT_STATE_NAME = makeReadOnly([
                "GPS_FIX_HOME",
                "GPS_FIX",
                "CALIBRATE_MAG",
                "SMALL_ANGLE",
                "FIXED_WING",     // set when in flying_wing or airplane mode. currently used by althold selection code
                "ANTI_WINDUP",
                "FLAPERON_AVAILABLE",
                "NAV_MOTOR_STOP_OR_IDLE",     // navigation requests MOTOR_STOP or motor idle regardless of throttle stick, will only activate if MOTOR_STOP feature is available
                "COMPASS_CALIBRATED",
                "ACCELEROMETER_CALIBRATED",
                "PWM_DRIVER_AVAILABLE",
                "NAV_CRUISE_BRAKING",
                "NAV_CRUISE_BRAKING_BOOST",
                "NAV_CRUISE_BRAKING_LOCKED",
                "NAV_EXTRA_ARMING_SAFETY_BYPASSED",    // nav_extra_arming_safey was bypassed. Keep it until power cycle.
                "AIRMODE_ACTIVE",
                "ESC_SENSOR_ACT",
                "AIRPLANE",
                "MULTIROTOR",
                "ROVER",
                "BOAT",
                "ALT_CONTROL", // Altitude control
                "FORWARD_ONLY", // Move Forward Only
                "REV_MOTOR_FOR", // Reverse Motors Forward
                "HEADING_USE_YAW", // FW Heading use yaw
                "ANTIWINDUP_OFF" // Antiwindup Deactivated
        ]),

        FLIGHT_LOG_FAILSAFE_PHASE_NAME = makeReadOnly([
                "FAILSAFE_IDLE",
                "FAILSAFE_RX_LOSS_DETECTED",
                "FAILSAFE_RX_LOSS_IDLE",
                "FAILSAFE_RETURN_TO_HOME",
                "FAILSAFE_LANDING",
                "FAILSAFE_LANDED",
                "FAILSAFE_RX_LOSS_MONITORING",
                "FAILSAFE_RX_LOSS_RECOVERED"
        ]),

        FLIGHT_LOG_NAV_STATE = makeReadOnly([
                "OFF",
                "IDLE",
                "ALTHOLD_INITIALIZE",
                "ALTHOLD_IN_PROGRESS",
                "UNUSED_1",
                "UNUSED_2",
                "POSHOLD_3D_INITIALIZE",
                "POSHOLD_3D_IN_PROGRESS",
                "RTH_INITIALIZE",
                "RTH_CLIMB_TO_SAFE_ALT",
                "RTH_HEAD_HOME",
                "RTH_HOVER_PRIOR_TO_LANDING",
                "RTH_LANDING",
                "RTH_FINISHING",
                "RTH_FINISHED",
                "WAYPOINT_INITIALIZE",
                "WAYPOINT_PRE_ACTION",
                "WAYPOINT_IN_PROGRESS",
                "WAYPOINT_REACHED",
                "WAYPOINT_NEXT",
                "WAYPOINT_FINISHED",
                "WAYPOINT_RTH_LAND",
                "EMERGENCY_LANDING_INITIALIZE",
                "EMERGENCY_LANDING_IN_PROGRESS",
                "EMERGENCY_LANDING_FINISHED",
                "LAUNCH_INITIALIZE",
                "LAUNCH_WAIT",
                "UNUSED_3",
                "LAUNCH_IN_PROGRESS",
                "CRUISE_2D_INITIALIZE",
                "CRUISE_2D_IN_PROGRESS",
                "CRUISE_2D_ADJUSTING",
                "CRUISE_3D_INITIALIZE",
                "CRUISE_3D_IN_PROGRESS",
                "CRUISE_3D_ADJUSTING",
                "WAYPOINT_HOLD",
                "RTH_HOVER_ABOVE_HOME",
                "UNUSED_4"
        ]),
        
        FLIGHT_LOG_NAV_FLAGS = makeReadOnly([
                "ALT_TRUSTED",
                "AGL_TRUSTED",
                "POS_TRUSTED",
                "TERRAIN_FOLLOWING",
                "GPS_GLITCH",
                "HEADING_TRUSTED",
                "ADJUSTING_POSITION",
                "ADJUSTING_ALTITUDE",
                "ADJUSTING_HEADING"
        ]);
