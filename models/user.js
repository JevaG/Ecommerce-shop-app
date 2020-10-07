const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,

    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});
/*
    The methods key is an object which allows you to add your own
     methods and now in this function you can add your own logic
*/

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: product._id,
                quantity: newQuantity

            })
        }

        const updatedCart = {
            items: updatedCartItems
        };
        this.cart = updatedCart;
        return this.save();

}

userSchema.methods.removeFromCart = function(productId){
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
 }

userSchema.methods.clearCart = function(){
    this.cart = { items: [] };
    return this.save();
}
/*
    mongoose takes the model name, so product, turns it to all lowercase and
    takes the plural form of that and that will then be used as a collection (in mongodb)
*/

module.exports = mongoose.model('User', userSchema);










// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;
//
// const ObjectId = mongodb.ObjectId;
//
// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }
//
//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this);
//     }
//
//     addToCard(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];
//
//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity
//
//             })
//         }
//
//         const updatedCart = {
//             items: updatedCartItems
//         };
//
//         const db = getDb();
//         return db
//             .collection('users')
//             .updateOne(
//             { _id: new ObjectId(this._id) } ,
//             { $set: { cart: updatedCart } }
//         );
//     }
//
//
//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         })
//         /*
//             $in operator selects the documents where
//             the value of a field equals any value in the
//             specified array. example
//             db.inventory.find( { qty: { $in: [ 5, 15 ] } } )
//             This query selects all documents in the inventory
//             collection where the qty field value is either 5 or 15.
//          */
//         return db
//             .collection('products')
//             .find({_id: {$in: productIds }})
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 });
//             });
//     }
//
//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         });
//         const db = getDb();
//         // items: mongodb property
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: new ObjectId(this._id) } ,
//                 { $set: { cart: {items: updatedCartItems} } }
//             );
//     }
//
//     addOrder() {
//          return this.getCart()
//              .then(products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         name: this.name
//                     }
//                 };
//                 return db.collection('orders').insertOne(order);
//             })
//             .then(result => {
//                 this.cart = { items: [] };
//                 return db
//                     .collection('users')
//                     .updateOne(
//                         { _id: new ObjectId(this._id) } ,
//                         { $set: { cart: {items: []} } }
//                     );
//             });
//     }
//
//     getOrders() {
//         const db = getDb();
//         return db
//             .collection('orders')
//             .find({ 'user._id': new ObjectId(this._id) })
//             .toArray();
//     }
//
//     static findById(userId) {
//         const db = getDb();
//         return db
//             .collection('users')
//             .findOne({ _id: new ObjectId(userId) })
//             .then(user => {
//                 console.log(user);
//                 return user;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
// }
//
// module.exports = User;