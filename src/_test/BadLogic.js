function hasBad(obj, mixins, toplevel = "") {
    let child = new Set(['item.hookshot', 'item.bow', 'item.hammer', 'item.cojiro', 'item.arrow_fire',
        'item.arrow_ice', 'item.arrow_light', 'item.sword_biggoron', 'item.shield_mirror', 'item.tunic_fire',
        'item.tunic_water', 'item.boots_iron', 'item.boots_hover']);
    let adult = new Set(['item.boomerang', 'item.stick', 'item.slingshot', 'item.sword_kokiri', 'item.shield_kokiri']);

    if(mixins.has(obj.el))
        return true

    if(child.has(obj.el) && toplevel.endsWith("[child]"))
        return true

    if(adult.has(obj.el) && toplevel.endsWith("[adult]"))
        return true

    return false
}


export function filterFailedMixins(data) {
    let [logic, mixins] = data;
    let res = logic;

    for(const topLevel in res.edges) {
        let one = res.edges[topLevel]
        /*delObj(one, mixins)
        orFix(one);*/
        if(typeof one === "object"){
            for(const level in one) {
                let two = one[level];

                if(typeof two === "object") {
                    for(const level in two) {
                        let three = two[level]

                        if(typeof three === "object") {
                            for(const level in three) {
                                let four = three[level]

                                if(typeof four === "object") {
                                    for(const level in four) {
                                        let five = four[level]

                                        if(typeof five === "object") {
                                            for(const level in five) {
                                                let six = five[level]

                                                if(typeof six === "object") {
                                                    for(const level in six) {
                                                        let seven = six[level]

                                                        if(typeof seven === "object") {
                                                            for(const level in seven) {
                                                                let eight = seven[level]

                                                                if(typeof eight === "object") {
                                                                    for(const level in eight) {
                                                                        let nine = eight[level]

                                                                        if(typeof nine === "object") {
                                                                            for(const level in nine) {
                                                                                let ten = nine[level]

                                                                                if(typeof ten === "object") {
                                                                                    for(const level in ten) {
                                                                                        let eleven = ten[level]

                                                                                        if(typeof eleven === "object") {
                                                                                            for(const level in eleven) {
                                                                                                let twelve = eleven[level]

                                                                                                if(typeof twelve === "object") {
                                                                                                    for(const level in twelve) {
                                                                                                        let thirteen = twelve[level]

                                                                                                        if(typeof thirteen === "object") {
                                                                                                            for(const level in thirteen) {
                                                                                                                let fourteen = thirteen[level]

                                                                                                                if(typeof fourteen === "object") {
                                                                                                                    for(const level in fourteen) {
                                                                                                                        let fifteen = fourteen[level]

                                                                                                                        if(typeof fifteen === "object") {
                                                                                                                            for(const level in fifteen) {
                                                                                                                                let sixteen = fifteen[level]

                                                                                                                                if(typeof sixteen === "object") {
                                                                                                                                    for(const level in sixteen) {
                                                                                                                                        let seventeen = sixteen[level]

                                                                                                                                        if(typeof seventeen === "object") {
                                                                                                                                            for(const level in seventeen) {
                                                                                                                                                let eightteen = seventeen[level]

                                                                                                                                                if(typeof eightteen === "object") {
                                                                                                                                                    for(const level in eightteen) {
                                                                                                                                                        let nineteen = eightteen[level]

                                                                                                                                                        if(typeof nineteen === "object") {
                                                                                                                                                            for(const level in nineteen) {
                                                                                                                                                                let twenty = nineteen[level]

                                                                                                                                                                if(typeof twenty === "object") {
                                                                                                                                                                    for(const level in twenty) {
                                                                                                                                                                        let twentyone = twenty[level]

                                                                                                                                                                        if(typeof twentyone === "object") {
                                                                                                                                                                            for(const level in twentyone) {
                                                                                                                                                                                let twentytwo = twentyone[level]

                                                                                                                                                                                if(typeof twentytwo === "object") {
                                                                                                                                                                                    if(hasBad(twentytwo, mixins))
                                                                                                                                                                                        delete twentyone[level]
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                            if(Array.isArray(twentyone))
                                                                                                                                                                                twenty[level] = twentyone.filter(value => Object.keys(value).length > 0)
                                                                                                                                                                            if(hasBad(twentyone, mixins))
                                                                                                                                                                                delete twenty[level]
                                                                                                                                                                        }

                                                                                                                                                                    }
                                                                                                                                                                    if(Array.isArray(twenty))
                                                                                                                                                                        nineteen[level] = twenty.filter(value => Object.keys(value).length > 0)
                                                                                                                                                                    if(hasBad(twenty, mixins))
                                                                                                                                                                        delete nineteen[level]
                                                                                                                                                                }

                                                                                                                                                            }
                                                                                                                                                            if(Array.isArray(nineteen))
                                                                                                                                                                eightteen[level] = nineteen.filter(value => Object.keys(value).length > 0)
                                                                                                                                                            if(hasBad(nineteen, mixins))
                                                                                                                                                                delete eightteen[level]
                                                                                                                                                        }

                                                                                                                                                    }
                                                                                                                                                    if(Array.isArray(eightteen))
                                                                                                                                                        seventeen[level] = eightteen.filter(value => Object.keys(value).length > 0)
                                                                                                                                                    if(hasBad(eightteen, mixins))
                                                                                                                                                        delete seventeen[level]
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                            if(Array.isArray(seventeen))
                                                                                                                                                sixteen[level] = seventeen.filter(value => Object.keys(value).length > 0)
                                                                                                                                            if(hasBad(seventeen, mixins))
                                                                                                                                                delete sixteen[level]
                                                                                                                                        }

                                                                                                                                    }
                                                                                                                                    if(Array.isArray(sixteen))
                                                                                                                                        fifteen[level] = sixteen.filter(value => Object.keys(value).length > 0)
                                                                                                                                    if(hasBad(sixteen, mixins))
                                                                                                                                        delete fifteen[level]
                                                                                                                                }

                                                                                                                            }
                                                                                                                            if(Array.isArray(fifteen))
                                                                                                                                fourteen[level] = fifteen.filter(value => Object.keys(value).length > 0)
                                                                                                                            if(hasBad(fifteen, mixins))
                                                                                                                                delete fourteen[level]
                                                                                                                        }

                                                                                                                    }
                                                                                                                    if(Array.isArray(fourteen))
                                                                                                                        thirteen[level] = fourteen.filter(value => Object.keys(value).length > 0)
                                                                                                                    if(hasBad(fourteen, mixins))
                                                                                                                        delete thirteen[level]
                                                                                                                }

                                                                                                            }
                                                                                                            if(Array.isArray(thirteen))
                                                                                                                twelve[level] = thirteen.filter(value => Object.keys(value).length > 0)
                                                                                                            if(hasBad(thirteen, mixins))
                                                                                                                delete twelve[level]
                                                                                                        }

                                                                                                    }
                                                                                                    if(Array.isArray(twelve))
                                                                                                        eleven[level] = twelve.filter(value => Object.keys(value).length > 0)
                                                                                                    if(hasBad(twelve, mixins))
                                                                                                        delete eleven[level]
                                                                                                }

                                                                                            }
                                                                                            if(Array.isArray(eleven)) {
                                                                                                ten[level] = eleven.filter(value => Object.keys(value).length > 0)
                                                                                            }
                                                                                            if(hasBad(eleven, mixins))
                                                                                                delete ten[level]
                                                                                        }

                                                                                    }
                                                                                    if(Array.isArray(ten))
                                                                                        nine[level] = ten.filter(value => Object.keys(value).length > 0)
                                                                                    if(hasBad(ten, mixins))
                                                                                        delete nine[level]
                                                                                    //if(ten.type === 'or')console.log(ten)
                                                                                }
                                                                            }
                                                                            if(Array.isArray(nine))
                                                                                eight[level] = nine.filter(value => Object.keys(value).length > 0)
                                                                            if(hasBad(nine, mixins))
                                                                                delete eight[level]
                                                                        }

                                                                    }
                                                                    if(Array.isArray(eight))
                                                                        seven[level] = eight.filter(value => Object.keys(value).length > 0)
                                                                    if(hasBad(eight, mixins))
                                                                        delete seven[level]
                                                                }

                                                            }
                                                            if(Array.isArray(seven))
                                                                six[level] = seven.filter(value => Object.keys(value).length > 0)
                                                            if(hasBad(seven, mixins))
                                                                delete six[level]
                                                        }

                                                    }
                                                    if(Array.isArray(six))
                                                        five[level] = six.filter(value => Object.keys(value).length > 0)
                                                    if(hasBad(six, mixins))
                                                        delete five[level]
                                                }

                                            }
                                            if(Array.isArray(five))
                                                four[level] = five.filter(value => Object.keys(value).length > 0)
                                            if(hasBad(five, mixins))
                                                delete four[level]
                                        }

                                    }
                                    if(Array.isArray(four))
                                        three[level] = four.filter(value => Object.keys(value).length > 0)
                                    if(hasBad(four, mixins))
                                        delete three[level]
                                }

                            }
                            if(Array.isArray(three))
                                two[level] = three.filter(value => Object.keys(value).length > 0)
                            if(hasBad(three, mixins))
                                delete two[level]
                        }

                    }
                    if(Array.isArray(two))
                        one[level] = two.filter(value => Object.keys(value).length > 0)
                    if(hasBad(two, mixins))
                        delete one[level]
                }

            }
            if(Array.isArray(one))
                res.edges[topLevel] = one.filter(value => Object.keys(value).length > 0)
            if(hasBad(one, mixins))
                delete res.edges[topLevel]
        }

    }

    return res
}