export default function createOnRegionLogic(nodeC, elC, nodeA, elA, basic = false) {
    if (basic) {
        return {
            "type": "or",
            "content": [
                {
                    "type": "at",
                    "node": nodeC,
                    "content": elC
                },
                {
                    "type": "at",
                    "node": nodeA,
                    "content": elA
                }
            ]
        }
    } else {
        return {
            "type": "or",
            "content": [
                {
                    "type": "and",
                    "content": [
                        {
                            "type": "mixin",
                            "ref": "mixin[filter_era]{child}"
                        },
                        {
                            "type": "at",
                            "node": nodeC,
                            "content": elC
                        }
                    ]
                },
                {
                    "type": "and",
                    "content": [
                        {
                            "type": "mixin",
                            "ref": "mixin[filter_era]{adult}"
                        },
                        {
                            "type": "at",
                            "node": nodeA,
                            "content": elA
                        }
                    ]
                }
            ]
        }
    }
}
