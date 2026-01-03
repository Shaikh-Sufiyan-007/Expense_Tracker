import User from "../models/User.model.js"
import Income from "../models/Income.model.js"

export const addIncome = async(req,res) => {
    const userId = req.user.id;
    try {
        const {icon, source, amount, date} = req.body;

        if(!source || !amount || !date) {
            return res.status(400).json({message: "All fields are required."})
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(201).json(newIncome);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getAllIncomes = async(req,res) => {
    const userId = req.user.id;
    try {
        const incomes = await Income.find({userId}).sort({date: -1})
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const deleteIncome = async(req,res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Income deleted."})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const downloadIncomeExcel = async(req,res) => {}