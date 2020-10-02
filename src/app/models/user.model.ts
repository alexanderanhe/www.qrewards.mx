import {Digital} from "./digital.model";
import {Record} from "./record.model";
export class User {

    constructor(
        public digital: Digital,
        public record: Record,
        public valid_date?: any,
        public options?: any,
        public component?: boolean,
    ) { }

}
