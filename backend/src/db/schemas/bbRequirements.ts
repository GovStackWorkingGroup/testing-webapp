import mongoose from "mongoose";
import { RequirementSchema } from './compliance';

const BBRequirementSchema = new mongoose.Schema({
    bbName: {
        type: String,
        required: true
    },
    bbKey: {
        type: String,
        required: true,
        unique: false
    },
    bbVersion: {
        type: String,
        required: true
    },
    dateOfSave: {
        type: Date,
        default: Date.now
    },
    requirements: {
        crossCutting: [RequirementSchema],
        functional: [RequirementSchema],
    }
});

const BBRequirements = mongoose.model('BBRequirement', BBRequirementSchema);

export default BBRequirements;