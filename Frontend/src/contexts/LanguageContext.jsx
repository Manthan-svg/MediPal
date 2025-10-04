import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Language translations
const translations = {
  en: {
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Settings
    settings: 'Settings',
    profile: 'Profile',
    notifications: 'Notifications',
    appearance: 'Appearance',
    about: 'About',
    saveSettings: 'Save Settings',
    saveChanges: 'Save Changes',
    settingsSaved: 'Settings saved successfully!',
    themeUpdated: 'Theme updated successfully!',
    languageChanged: 'Language changed successfully!',
    timezoneChanged: 'Timezone changed successfully!',
    
    // Profile
    profileInformation: 'Profile Information',
    fullName: 'Full Name',
    age: 'Age',
    email: 'Email',
    phone: 'Phone',
    securitySettings: 'Security Settings',
    changePassword: 'Change Password',
    twoFactorAuth: 'Two-Factor Authentication',
    biometricAuth: 'Biometric Authentication',
    
    // Notifications
    notificationPreferences: 'Notification Preferences',
    medicationReminders: 'Medication Reminders',
    appointmentReminders: 'Appointment Reminders',
    healthGoalUpdates: 'Health Goal Updates',
    emergencyAlerts: 'Emergency Alerts',
    deliveryMethods: 'Delivery Methods',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    smsNotifications: 'SMS Notifications',
    
    // Appearance
    themeAndColors: 'Theme & Colors',
    colorScheme: 'Color Scheme',
    fontSize: 'Font Size',
    languageAndRegion: 'Language & Region',
    language: 'Language',
    timezone: 'Timezone',
    displayOptions: 'Display Options',
    animations: 'Animations',
    compactMode: 'Compact Mode',
    
    // About
    appInformation: 'App Information',
    version: 'Version',
    build: 'Build',
    lastUpdated: 'Last Updated',
    supportAndHelp: 'Support & Help',
    helpCenter: 'Help Center',
    contactSupport: 'Contact Support',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
  },
  es: {
    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    remove: 'Quitar',
    confirm: 'Confirmar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    
    // Settings
    settings: 'Configuración',
    profile: 'Perfil',
    notifications: 'Notificaciones',
    appearance: 'Apariencia',
    about: 'Acerca de',
    saveSettings: 'Guardar Configuración',
    saveChanges: 'Guardar Cambios',
    settingsSaved: '¡Configuración guardada exitosamente!',
    themeUpdated: '¡Tema actualizado exitosamente!',
    languageChanged: '¡Idioma cambiado exitosamente!',
    timezoneChanged: '¡Zona horaria cambiada exitosamente!',
    
    // Profile
    profileInformation: 'Información del Perfil',
    fullName: 'Nombre Completo',
    age: 'Edad',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    securitySettings: 'Configuración de Seguridad',
    changePassword: 'Cambiar Contraseña',
    twoFactorAuth: 'Autenticación de Dos Factores',
    biometricAuth: 'Autenticación Biométrica',
    
    // Notifications
    notificationPreferences: 'Preferencias de Notificación',
    medicationReminders: 'Recordatorios de Medicamentos',
    appointmentReminders: 'Recordatorios de Citas',
    healthGoalUpdates: 'Actualizaciones de Objetivos de Salud',
    emergencyAlerts: 'Alertas de Emergencia',
    deliveryMethods: 'Métodos de Entrega',
    emailNotifications: 'Notificaciones por Correo',
    pushNotifications: 'Notificaciones Push',
    smsNotifications: 'Notificaciones SMS',
    
    // Appearance
    themeAndColors: 'Tema y Colores',
    colorScheme: 'Esquema de Colores',
    fontSize: 'Tamaño de Fuente',
    languageAndRegion: 'Idioma y Región',
    language: 'Idioma',
    timezone: 'Zona Horaria',
    displayOptions: 'Opciones de Visualización',
    animations: 'Animaciones',
    compactMode: 'Modo Compacto',
    
    // About
    appInformation: 'Información de la Aplicación',
    version: 'Versión',
    build: 'Compilación',
    lastUpdated: 'Última Actualización',
    supportAndHelp: 'Soporte y Ayuda',
    helpCenter: 'Centro de Ayuda',
    contactSupport: 'Contactar Soporte',
    privacyPolicy: 'Política de Privacidad',
    termsOfService: 'Términos de Servicio',
  },
  fr: {
    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    remove: 'Retirer',
    confirm: 'Confirmer',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    
    // Settings
    settings: 'Paramètres',
    profile: 'Profil',
    notifications: 'Notifications',
    appearance: 'Apparence',
    about: 'À propos',
    saveSettings: 'Enregistrer les Paramètres',
    saveChanges: 'Enregistrer les Modifications',
    settingsSaved: 'Paramètres enregistrés avec succès !',
    themeUpdated: 'Thème mis à jour avec succès !',
    languageChanged: 'Langue changée avec succès !',
    timezoneChanged: 'Fuseau horaire changé avec succès !',
    
    // Profile
    profileInformation: 'Informations du Profil',
    fullName: 'Nom Complet',
    age: 'Âge',
    email: 'E-mail',
    phone: 'Téléphone',
    securitySettings: 'Paramètres de Sécurité',
    changePassword: 'Changer le Mot de Passe',
    twoFactorAuth: 'Authentification à Deux Facteurs',
    biometricAuth: 'Authentification Biométrique',
    
    // Notifications
    notificationPreferences: 'Préférences de Notification',
    medicationReminders: 'Rappels de Médicaments',
    appointmentReminders: 'Rappels de Rendez-vous',
    healthGoalUpdates: 'Mises à jour des Objectifs de Santé',
    emergencyAlerts: 'Alertes d\'Urgence',
    deliveryMethods: 'Méthodes de Livraison',
    emailNotifications: 'Notifications par E-mail',
    pushNotifications: 'Notifications Push',
    smsNotifications: 'Notifications SMS',
    
    // Appearance
    themeAndColors: 'Thème et Couleurs',
    colorScheme: 'Schéma de Couleurs',
    fontSize: 'Taille de Police',
    languageAndRegion: 'Langue et Région',
    language: 'Langue',
    timezone: 'Fuseau Horaire',
    displayOptions: 'Options d\'Affichage',
    animations: 'Animations',
    compactMode: 'Mode Compact',
    
    // About
    appInformation: 'Informations sur l\'Application',
    version: 'Version',
    build: 'Build',
    lastUpdated: 'Dernière Mise à Jour',
    supportAndHelp: 'Support et Aide',
    helpCenter: 'Centre d\'Aide',
    contactSupport: 'Contacter le Support',
    privacyPolicy: 'Politique de Confidentialité',
    termsOfService: 'Conditions d\'Utilisation',
  },
  de: {
    // Common
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    remove: 'Entfernen',
    confirm: 'Bestätigen',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    
    // Settings
    settings: 'Einstellungen',
    profile: 'Profil',
    notifications: 'Benachrichtigungen',
    appearance: 'Erscheinungsbild',
    about: 'Über',
    saveSettings: 'Einstellungen Speichern',
    saveChanges: 'Änderungen Speichern',
    settingsSaved: 'Einstellungen erfolgreich gespeichert!',
    themeUpdated: 'Design erfolgreich aktualisiert!',
    languageChanged: 'Sprache erfolgreich geändert!',
    timezoneChanged: 'Zeitzone erfolgreich geändert!',
    
    // Profile
    profileInformation: 'Profilinformationen',
    fullName: 'Vollständiger Name',
    age: 'Alter',
    email: 'E-Mail',
    phone: 'Telefon',
    securitySettings: 'Sicherheitseinstellungen',
    changePassword: 'Passwort Ändern',
    twoFactorAuth: 'Zwei-Faktor-Authentifizierung',
    biometricAuth: 'Biometrische Authentifizierung',
    
    // Notifications
    notificationPreferences: 'Benachrichtigungseinstellungen',
    medicationReminders: 'Medikamentenerinnerungen',
    appointmentReminders: 'Terminerinnerungen',
    healthGoalUpdates: 'Gesundheitsziel-Updates',
    emergencyAlerts: 'Notfallbenachrichtigungen',
    deliveryMethods: 'Übermittlungsmethoden',
    emailNotifications: 'E-Mail-Benachrichtigungen',
    pushNotifications: 'Push-Benachrichtigungen',
    smsNotifications: 'SMS-Benachrichtigungen',
    
    // Appearance
    themeAndColors: 'Design und Farben',
    colorScheme: 'Farbschema',
    fontSize: 'Schriftgröße',
    languageAndRegion: 'Sprache und Region',
    language: 'Sprache',
    timezone: 'Zeitzone',
    displayOptions: 'Anzeigeoptionen',
    animations: 'Animationen',
    compactMode: 'Kompakter Modus',
    
    // About
    appInformation: 'App-Informationen',
    version: 'Version',
    build: 'Build',
    lastUpdated: 'Zuletzt Aktualisiert',
    supportAndHelp: 'Support und Hilfe',
    helpCenter: 'Hilfezentrum',
    contactSupport: 'Support Kontaktieren',
    privacyPolicy: 'Datenschutzrichtlinie',
    termsOfService: 'Nutzungsbedingungen',
  },
  zh: {
    // Common
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    remove: '移除',
    confirm: '确认',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    
    // Settings
    settings: '设置',
    profile: '个人资料',
    notifications: '通知',
    appearance: '外观',
    about: '关于',
    saveSettings: '保存设置',
    saveChanges: '保存更改',
    settingsSaved: '设置保存成功！',
    themeUpdated: '主题更新成功！',
    languageChanged: '语言更改成功！',
    timezoneChanged: '时区更改成功！',
    
    // Profile
    profileInformation: '个人资料信息',
    fullName: '全名',
    age: '年龄',
    email: '电子邮件',
    phone: '电话',
    securitySettings: '安全设置',
    changePassword: '更改密码',
    twoFactorAuth: '双因素认证',
    biometricAuth: '生物识别认证',
    
    // Notifications
    notificationPreferences: '通知偏好',
    medicationReminders: '药物提醒',
    appointmentReminders: '预约提醒',
    healthGoalUpdates: '健康目标更新',
    emergencyAlerts: '紧急警报',
    deliveryMethods: '传递方式',
    emailNotifications: '电子邮件通知',
    pushNotifications: '推送通知',
    smsNotifications: '短信通知',
    
    // Appearance
    themeAndColors: '主题和颜色',
    colorScheme: '配色方案',
    fontSize: '字体大小',
    languageAndRegion: '语言和地区',
    language: '语言',
    timezone: '时区',
    displayOptions: '显示选项',
    animations: '动画',
    compactMode: '紧凑模式',
    
    // About
    appInformation: '应用信息',
    version: '版本',
    build: '构建',
    lastUpdated: '最后更新',
    supportAndHelp: '支持和帮助',
    helpCenter: '帮助中心',
    contactSupport: '联系支持',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',
  },
  ja: {
    // Common
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    add: '追加',
    remove: '削除',
    confirm: '確認',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    
    // Settings
    settings: '設定',
    profile: 'プロフィール',
    notifications: '通知',
    appearance: '外観',
    about: 'について',
    saveSettings: '設定を保存',
    saveChanges: '変更を保存',
    settingsSaved: '設定が正常に保存されました！',
    themeUpdated: 'テーマが正常に更新されました！',
    languageChanged: '言語が正常に変更されました！',
    timezoneChanged: 'タイムゾーンが正常に変更されました！',
    
    // Profile
    profileInformation: 'プロフィール情報',
    fullName: 'フルネーム',
    age: '年齢',
    email: 'メール',
    phone: '電話',
    securitySettings: 'セキュリティ設定',
    changePassword: 'パスワードを変更',
    twoFactorAuth: '二要素認証',
    biometricAuth: '生体認証',
    
    // Notifications
    notificationPreferences: '通知設定',
    medicationReminders: '薬のリマインダー',
    appointmentReminders: '予約リマインダー',
    healthGoalUpdates: '健康目標の更新',
    emergencyAlerts: '緊急アラート',
    deliveryMethods: '配信方法',
    emailNotifications: 'メール通知',
    pushNotifications: 'プッシュ通知',
    smsNotifications: 'SMS通知',
    
    // Appearance
    themeAndColors: 'テーマと色',
    colorScheme: 'カラースキーム',
    fontSize: 'フォントサイズ',
    languageAndRegion: '言語と地域',
    language: '言語',
    timezone: 'タイムゾーン',
    displayOptions: '表示オプション',
    animations: 'アニメーション',
    compactMode: 'コンパクトモード',
    
    // About
    appInformation: 'アプリ情報',
    version: 'バージョン',
    build: 'ビルド',
    lastUpdated: '最終更新',
    supportAndHelp: 'サポートとヘルプ',
    helpCenter: 'ヘルプセンター',
    contactSupport: 'サポートに連絡',
    privacyPolicy: 'プライバシーポリシー',
    termsOfService: '利用規約',
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('America/New_York')

  // Load language and timezone from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('mediPal-language')
    const savedTimezone = localStorage.getItem('mediPal-timezone')
    
    if (savedLanguage) {
      setLanguage(savedLanguage)
      document.documentElement.lang = savedLanguage
    }
    
    if (savedTimezone) {
      setTimezone(savedTimezone)
    }
  }, [])

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem('mediPal-language', newLanguage)
    document.documentElement.lang = newLanguage
  }

  const changeTimezone = (newTimezone) => {
    setTimezone(newTimezone)
    localStorage.setItem('mediPal-timezone', newTimezone)
  }

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  const formatDate = (date, options = {}) => {
    return new Intl.DateTimeFormat(language, {
      timeZone: timezone,
      ...options
    }).format(date)
  }

  const formatTime = (date, options = {}) => {
    return new Intl.DateTimeFormat(language, {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      ...options
    }).format(date)
  }

  const formatNumber = (number, options = {}) => {
    return new Intl.NumberFormat(language, options).format(number)
  }

  const value = {
    language,
    timezone,
    changeLanguage,
    changeTimezone,
    t,
    formatDate,
    formatTime,
    formatNumber
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
