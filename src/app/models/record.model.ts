export class Record {

    constructor(
        public id: number,
        public name?: string,
        public email?: string,
        public info?: any,
        public attached?: any,
        public birthdate?: string,
        public client_ip?: string,
        public cloudvision?: any,
        public component?: any,
        public created?: string,
        public digital_id?: string,
        public identifier?: string,
        public promo_id?: string
    ) {
        this.name = null;
        this.email = null;
        this.info = {};
    }

}
