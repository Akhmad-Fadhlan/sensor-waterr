/**
 * Blok untuk DFRobot PH Sensor
 */
//% weight=100 color=#0fbc11 icon="\uf043" block="PH Sensor"
namespace phSensor {
    let _phPin: AnalogPin = AnalogPin.P0;
    let _acidVoltage: number = 2032.44;
    let _neutralVoltage: number = 1500.0;
    let _temperature: number = 25.0;

    /**
     * Inisialisasi sensor pH dengan pin analog
     * @param pin Pin analog untuk membaca sensor pH, eg: AnalogPin.P0
     */
    //% blockId=ph_begin
    //% block="inisialisasi PH sensor di pin %pin"
    //% weight=100
    export function begin(pin: AnalogPin): void {
        _phPin = pin;
        // Load kalibrasi dari EEPROM jika diperlukan
        // Untuk MakeCode, kita gunakan nilai default
    }

    /**
     * Set suhu untuk kompensasi temperatur
     * @param temp Suhu dalam Celsius, eg: 25
     */
    //% blockId=ph_set_temperature
    //% block="set suhu kompensasi %temp °C"
    //% weight=90
    export function setTemperature(temp: number): void {
        _temperature = temp;
    }

    /**
     * Baca nilai pH dari sensor
     * @returns Nilai pH (0-14)
     */
    //% blockId=ph_read
    //% block="baca nilai pH"
    //% weight=80
    export function readPH(): number {
        let voltage = pins.analogReadPin(_phPin) / 1024.0 * 5000; // Convert ke mV
        return calculatePH(voltage, _temperature);
    }

    /**
     * Baca nilai tegangan dari sensor
     * @returns Tegangan dalam mV
     */
    //% blockId=ph_read_voltage
    //% block="baca tegangan sensor (mV)"
    //% weight=70
    export function readVoltage(): number {
        return pins.analogReadPin(_phPin) / 1024.0 * 5000;
    }

    /**
     * Kalibrasi dengan larutan buffer pH 7.0 (netral)
     * Celupkan sensor ke larutan pH 7.0 kemudian panggil fungsi ini
     */
    //% blockId=ph_calibrate_neutral
    //% block="kalibrasi larutan netral (pH 7.0)"
    //% weight=60
    export function calibrateNeutral(): void {
        _neutralVoltage = pins.analogReadPin(_phPin) / 1024.0 * 5000;
        basic.showString("N");
    }

    /**
     * Kalibrasi dengan larutan buffer pH 4.0 (asam)
     * Celupkan sensor ke larutan pH 4.0 kemudian panggil fungsi ini
     */
    //% blockId=ph_calibrate_acid
    //% block="kalibrasi larutan asam (pH 4.0)"
    //% weight=50
    export function calibrateAcid(): void {
        _acidVoltage = pins.analogReadPin(_phPin) / 1024.0 * 5000;
        basic.showString("A");
    }

    /**
     * Fungsi internal untuk menghitung pH dari tegangan
     */
    function calculatePH(voltage: number, temperature: number): number {
        let slope = (7.0 - 4.0) / ((_neutralVoltage - 1500.0) / 3.0 - (_acidVoltage - 1500.0) / 3.0);
        let intercept = 7.0 - slope * (_neutralVoltage - 1500.0) / 3.0;
        let phValue = slope * (voltage - 1500.0) / 3.0 + intercept;
        
        // Round ke 2 desimal
        return Math.round(phValue * 100) / 100;
    }

    /**
     * Reset kalibrasi ke nilai default
     */
    //% blockId=ph_reset_calibration
    //% block="reset kalibrasi"
    //% weight=40
    export function resetCalibration(): void {
        _acidVoltage = 2032.44;
        _neutralVoltage = 1500.0;
        basic.showString("R");
    }
}
