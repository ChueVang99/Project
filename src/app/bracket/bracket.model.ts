
interface IBracket {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    editing?: boolean;
}
export class Bracket {

    public id?: number;

    constructor(bracket: IBracket) {
        bracket.editing = this.setState(bracket);
        Object.assign(this, bracket);
    }

    setState(bracket: IBracket) {
        if (bracket == null || Object.keys(bracket).length == 0) {
            return true;
        }
        let editing = false;
        Object.keys(bracket).forEach((key) => {
            if (bracket[key] == null) {
                editing = true;
            }
        });
        return editing;
    }
}