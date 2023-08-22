const FeatureTable = new Map();

const hasFeature = key => {
    return FeatureTable.has(key);
}

const getFeature = key => {
    return FeatureTable.get(key);
}

const setFeature = (key, value) => {
    FeatureTable.set(key, value);
}

const deleteFeature = (key) => {
    FeatureTable.delete(key);
}

const getAllFeatures = () => {
    return Array.from(FeatureTable.entries())
}

const clear = () => {
    FeatureTable.clear();
}

const Switch = {
    hasFeature,
    getFeature,
    setFeature,
    deleteFeature,
    getAllFeatures,
    clear
};

export default Switch;
