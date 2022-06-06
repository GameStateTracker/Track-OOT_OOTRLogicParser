export default function createOnRegionLogic(nodeC, elC, nodeA, elA, basic = false) {
    if (basic) {
        return {
            "type": "or",
            "el": [
                {
                    "type": "at",
                    "node": nodeC,
                    "el": elC
                },
                {
                    "type": "at",
                    "node": nodeA,
                    "el": elA
                }
            ]
        }
    } else {
        return {
            "type": "or",
            "el": [
                {
                    "type": "and",
                    "el": [
                        {
                            "type": "mixin",
                            "el": "mixin[filter_era]{child}"
                        },
                        {
                            "type": "at",
                            "node": nodeC,
                            "el": elC
                        }
                    ]
                },
                {
                    "type": "and",
                    "el": [
                        {
                            "type": "mixin",
                            "el": "mixin[filter_era]{adult}"
                        },
                        {
                            "type": "at",
                            "node": nodeA,
                            "el": elA
                        }
                    ]
                }
            ]
        }
    }
}
