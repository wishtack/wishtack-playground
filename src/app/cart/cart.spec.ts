class Cart {
    /**
     * @deprecated 🚧 Work in progress.
     */
    addItem(item: Item) {
        throw new Error('🚧 work in progress!');
    }

    /**
     * @deprecated 🚧 Work in progress.
     */
    getItemList() {
        throw new Error('🚧 work in progress!');
    }
}

/**
 * @deprecated 🚧 Work in progress.
 */
class Item {
    constructor(public name: string, public price: number) {}
}

describe('Cart', () => {
    it('🚧 should add items', () => {
        const cart = new Cart();
        const burger = new Item('Burger', 12);
        const butter = new Item('Double Beurre', 5);
        // cart.addItem(burger);
        // cart.addItem(butter);
        // const itemList = cart.getItemList();
        // expect(itemList).toEqual([burger, butter]);
    });
});
