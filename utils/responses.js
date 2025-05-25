function success(data, message) {
    return {
      success: true,
      data: data,
      message: message || 'Sucesso'
    };
  }
  
  function error(errors, message) {
    return {
      success: false,
      errors: Array.isArray(errors) ? errors : [errors],
      message: message || 'Erro'
    };
  }
  
  module.exports = { success, error };