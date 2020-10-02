export class Digital {

    constructor(
        public id: number,
        public name: string,
        public type: string,
        public amount: number,
        public apply_stock: number = 0 | 1,
        public cinepolis: string,
        public email_id: string,
        public rchrg_email: string,
    ) { }

}
