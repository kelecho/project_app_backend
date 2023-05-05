import Usuario from "../models/Usuario.js";


const cambiarPremium = async (req, res) => {
    console.log(req.body)
    const userId = req.body.id
    const usuario = await Usuario.findOneAndUpdate(
        { _id: userId },
        { $set: { premium: true } },
        { new: true } // para devolver la instancia actualizada
    )
    await usuario.save()
    res.json({msg:'Usuario actualizado a premium'});
}

export {
    cambiarPremium
  };