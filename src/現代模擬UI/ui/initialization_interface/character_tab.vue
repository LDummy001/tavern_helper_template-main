<template>
  <div class="character-tabs-container">
    <h3>角色資料設定</h3>

    <!-- 其他角色動態摺疊欄 -->
    <div
      v-for="[character_id, character_data] in other_characters_entries"
      :key="character_id"
      class="character-fold-bar"
      :class="{ 'character-incomplete': !isCharacterComplete(character_data) }"
    >
      <FoldBarComponent :title="`${character_id}: ${getCharacterDisplayName(character_data)}`" :is-open="false">
        <template #title-actions>
          <button class="remove-character-btn" title="移除角色" @click="removeCharacter(character_id)">
            <span>×</span>
          </button>
        </template>
        <div class="character-info-container">
          <div class="section">
            <h4>基本資訊</h4>
            <div class="form-grid">
              <div class="input-group">
                <label>姓氏</label>
                <input v-model="character_data.姓氏" type="text" placeholder="例如：張" class="text-input" />
                <div v-if="character_data.generated_surname" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_surname }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '姓氏', character_data.generated_surname)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>名字</label>
                <input v-model="character_data.名字" type="text" placeholder="例如：小明" class="text-input" />
                <div v-if="character_data.generated_name" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_name }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '名字', character_data.generated_name)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>年齡</label>
                <input
                  :value="getNumberValue(character_data, '年齡')"
                  type="number"
                  placeholder="例如：18"
                  class="text-input"
                  min="0"
                  max="200"
                  @input="setNumberValue(character_data, '年齡', ($event.target as HTMLInputElement).value)"
                />
                <div v-if="character_data.generated_age" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_age }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '年齡', character_data.generated_age)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>性別</label>
                <input v-model="character_data.性別" type="text" placeholder="例如：女" class="text-input" />
                <div v-if="character_data.generated_gender" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_gender }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '性別', character_data.generated_gender)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>身份</label>
                <input v-model="character_data.身份" type="text" placeholder="例如：高中生" class="text-input" />
                <div v-if="character_data.generated_identity" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_identity }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '身份', character_data.generated_identity)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>身高 (cm)</label>
                <input
                  :value="getNumberValue(character_data, '身高')"
                  type="number"
                  placeholder="例如：165"
                  class="text-input"
                  min="0"
                  max="300"
                  @input="setNumberValue(character_data, '身高', ($event.target as HTMLInputElement).value)"
                />
                <div v-if="character_data.generated_height" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_height }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '身高', character_data.generated_height)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>體重 (kg)</label>
                <input
                  :value="getNumberValue(character_data, '體重')"
                  type="number"
                  placeholder="例如：50"
                  class="text-input"
                  min="0"
                  max="500"
                  @input="setNumberValue(character_data, '體重', ($event.target as HTMLInputElement).value)"
                />
                <div v-if="character_data.generated_weight" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_weight }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '體重', character_data.generated_weight)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>胸圍 (cm)</label>
                <input
                  :value="getNumberValue(character_data, '胸圍')"
                  type="number"
                  placeholder="例如：85"
                  class="text-input"
                  min="0"
                  max="200"
                  @input="setNumberValue(character_data, '胸圍', ($event.target as HTMLInputElement).value)"
                />
                <div v-if="character_data.generated_chest_size" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_chest_size }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '胸圍', character_data.generated_chest_size)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>罩杯</label>
                <input v-model="character_data.罩杯" type="text" placeholder="例如：C" class="text-input" />
                <div v-if="character_data.generated_cup_size" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_cup_size }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '罩杯', character_data.generated_cup_size)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>腰圍 (cm)</label>
                <input
                  :value="getNumberValue(character_data, '腰圍')"
                  type="number"
                  placeholder="例如：60"
                  class="text-input"
                  min="0"
                  max="200"
                  @input="setNumberValue(character_data, '腰圍', ($event.target as HTMLInputElement).value)"
                />
                <div v-if="character_data.generated_waist_size" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_waist_size }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '腰圍', character_data.generated_waist_size)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>臀圍 (cm)</label>
                <input
                  :value="getNumberValue(character_data, '臀圍')"
                  type="number"
                  placeholder="例如：88"
                  class="text-input"
                  min="0"
                  max="200"
                  @input="setNumberValue(character_data, '臀圍', ($event.target as HTMLInputElement).value)"
                />
                <div v-if="character_data.generated_hips_size" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_hips_size }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '臀圍', character_data.generated_hips_size)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>髮型</label>
                <input v-model="character_data.髮型" type="text" placeholder="例如：黑色長直髮" class="text-input" />
                <div v-if="character_data.generated_hairstyle" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_hairstyle }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '髮型', character_data.generated_hairstyle)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>生日</label>
                <div class="birthday-inputs">
                  <input
                    :value="getNumberValue(character_data, '生日月份')"
                    type="number"
                    placeholder="月"
                    class="birthday-input"
                    min="1"
                    max="12"
                    @input="setNumberValue(character_data, '生日月份', ($event.target as HTMLInputElement).value)"
                  />
                  <input
                    :value="getNumberValue(character_data, '生日日期')"
                    type="number"
                    placeholder="日"
                    class="birthday-input"
                    min="1"
                    max="31"
                    @input="setNumberValue(character_data, '生日日期', ($event.target as HTMLInputElement).value)"
                  />
                </div>
                <div
                  v-if="character_data.generated_birthday_month || character_data.generated_birthday_day"
                  class="generated-result"
                >
                  <label>生成結果：</label>
                  <div class="generated-text">
                    {{ character_data.generated_birthday_month }}月 {{ character_data.generated_birthday_day }}日
                  </div>
                  <button
                    class="replace-btn"
                    @click="
                      applyGeneratedField(
                        character_id,
                        '生日',
                        `${character_data.generated_birthday_month}-${character_data.generated_birthday_day}`,
                      )
                    "
                  >
                    使用
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h4>外貌描述</h4>
            <div class="form-grid">
              <div class="input-group full-width">
                <label>外貌</label>
                <textarea
                  v-model="character_data.樣貌"
                  placeholder="描述外貌特徵..."
                  class="text-area"
                  rows="3"
                ></textarea>
                <div v-if="character_data.generated_appearance" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_appearance }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '樣貌', character_data.generated_appearance)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>服裝</label>
                <textarea
                  v-model="character_data.衣著"
                  placeholder="描述常穿的服裝..."
                  class="text-area"
                  rows="3"
                ></textarea>
                <div v-if="character_data.generated_clothes" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_clothes }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '衣著', character_data.generated_clothes)"
                  >
                    使用
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h4>性格與喜好</h4>
            <div class="form-grid">
              <div class="input-group full-width">
                <label>簡介</label>
                <textarea
                  v-model="character_data.簡介"
                  placeholder="簡單介紹角色..."
                  class="text-area"
                  rows="3"
                ></textarea>
                <div v-if="character_data.generated_introduction" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_introduction }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '簡介', character_data.generated_introduction)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>性格</label>
                <textarea
                  v-model="character_data.性格"
                  placeholder="描述性格特點..."
                  class="text-area"
                  rows="3"
                ></textarea>
                <div v-if="character_data.generated_personality" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_personality }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '性格', character_data.generated_personality)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>愛好</label>
                <textarea
                  v-model="character_data.愛好"
                  placeholder="描述喜歡的事物..."
                  class="text-area"
                  rows="3"
                ></textarea>
                <div v-if="character_data.generated_favourite" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_favourite }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '愛好', character_data.generated_favourite)"
                  >
                    使用
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h4>其他資訊</h4>
            <div class="form-grid">
              <div class="input-group">
                <label>金錢</label>
                <input
                  :value="getNumberValue(character_data, '金錢')"
                  type="number"
                  placeholder="例如：10000"
                  class="text-input"
                  min="0"
                  @input="setNumberValue(character_data, '金錢', ($event.target as HTMLInputElement).value)"
                />
                <div v-if="character_data.generated_money" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_money }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '金錢', character_data.generated_money)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>心情 (-100~100)</label>
                <input
                  :value="getNumberValue(character_data, '心情')"
                  type="number"
                  placeholder="例如：50"
                  class="text-input"
                  min="0"
                  max="100"
                  @input="setNumberValue(character_data, '心情', ($event.target as HTMLInputElement).value)"
                />
                <div v-if="character_data.generated_mood" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_mood }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '心情', character_data.generated_mood)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group">
                <label>性慾 (0~100)</label>
                <input
                  :value="getNumberValue(character_data, '性慾')"
                  type="number"
                  placeholder="例如：0"
                  class="text-input"
                  min="0"
                  max="100"
                  @input="setNumberValue(character_data, '性慾', ($event.target as HTMLInputElement).value)"
                />
                <div v-if="character_data.generated_sexuality" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_sexuality }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '性慾', character_data.generated_sexuality)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>其他重要資訊</label>
                <textarea
                  v-model="character_data.其他重要資訊"
                  placeholder="其他需要描述的資訊..."
                  class="text-area"
                  rows="3"
                ></textarea>
                <div v-if="character_data.generated_extra_information" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_extra_information }}</div>
                  <button
                    class="replace-btn"
                    @click="
                      applyGeneratedField(character_id, '其他重要資訊', character_data.generated_extra_information)
                    "
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>關係</label>
                <div class="relations-list">
                  <div
                    v-for="[target_id, relation_desc] in Array.from(character_data.關係 || new Map())"
                    :key="target_id"
                    class="relation-item"
                  >
                    <span class="relation-target">[{{ target_id }}] {{ getCharacterDisplayNameById(target_id) }}</span>
                    是此角色的
                    <input
                      :value="relation_desc"
                      type="text"
                      placeholder="輸入關係描述"
                      class="relation-input"
                      @input="updateRelation(character_id, target_id, ($event.target as HTMLInputElement).value)"
                    />
                    <button class="remove-relation-btn" @click="removeRelation(character_id, target_id)">×</button>
                  </div>
                  <div class="add-relation">
                    <select v-model="character_data.selected_relation_target" class="relation-select">
                      <option value="">選擇目標角色</option>
                      <option v-for="[id, data] in getAllOtherCharacters(character_id)" :key="id" :value="id">
                        {{ `${id}: ${data.姓氏 || ''}${data.名字 || ''}` }}
                      </option>
                    </select>
                    <button
                      class="add-relation-btn"
                      :disabled="!character_data.selected_relation_target"
                      @click="addRelation(character_id)"
                    >
                      添加關係
                    </button>
                  </div>
                </div>
                <div v-if="character_data.generated_relationship" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_relationship }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '關係', character_data.generated_relationship)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>友好度 (-1000~1000)</label>
                <div class="relations-list">
                  <div
                    v-for="[target_id, friendship_value] in Array.from(character_data.友好度 || new Map())"
                    :key="target_id"
                    class="relation-item"
                  >
                    <span class="relation-target">[{{ target_id }}] {{ getCharacterDisplayNameById(target_id) }}</span>
                    :
                    <input
                      :value="friendship_value"
                      type="number"
                      placeholder="輸入友好度數值"
                      class="relation-input"
                      min="0"
                      max="100"
                      @input="updateFriendship(character_id, target_id, ($event.target as HTMLInputElement).value)"
                    />
                    <button class="remove-relation-btn" @click="removeFriendship(character_id, target_id)">×</button>
                  </div>
                  <div class="add-relation">
                    <select v-model="character_data.selected_friendship_target" class="relation-select">
                      <option value="">選擇目標角色</option>
                      <option v-for="[id, data] in getAllOtherCharacters(character_id)" :key="id" :value="id">
                        {{ `${id}: ${data.姓氏 || ''}${data.名字 || ''}` }}
                      </option>
                    </select>
                    <button
                      class="add-relation-btn"
                      :disabled="!character_data.selected_friendship_target"
                      @click="addFriendship(character_id)"
                    >
                      添加友好度
                    </button>
                  </div>
                </div>
                <div v-if="character_data.generated_friendship" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_friendship }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '友好度', character_data.generated_friendship)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>愛情度 (0~1000)</label>
                <div class="relations-list">
                  <div
                    v-for="[target_id, love_value] in Array.from(character_data.愛情度 || new Map())"
                    :key="target_id"
                    class="relation-item"
                  >
                    <span class="relation-target">[{{ target_id }}] {{ getCharacterDisplayNameById(target_id) }}</span>
                    :
                    <input
                      :value="love_value"
                      type="number"
                      placeholder="輸入愛情度數值"
                      class="relation-input"
                      min="0"
                      max="100"
                      @input="updateLove(character_id, target_id, ($event.target as HTMLInputElement).value)"
                    />
                    <button class="remove-relation-btn" @click="removeLove(character_id, target_id)">×</button>
                  </div>
                  <div class="add-relation">
                    <select v-model="character_data.selected_love_target" class="relation-select">
                      <option value="">選擇目標角色</option>
                      <option v-for="[id, data] in getAllOtherCharacters(character_id)" :key="id" :value="id">
                        {{ `${id}: ${data.姓氏 || ''}${data.名字 || ''}` }}
                      </option>
                    </select>
                    <button
                      class="add-relation-btn"
                      :disabled="!character_data.selected_love_target"
                      @click="addLove(character_id)"
                    >
                      添加愛情度
                    </button>
                  </div>
                </div>
                <div v-if="character_data.generated_love" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_love }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '愛情度', character_data.generated_love)"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div class="input-group full-width">
                <label>所持物</label>
                <div class="inventory-list">
                  <div
                    v-for="[item_id, quantity] in Array.from(character_data.所持物 || new Map())"
                    :key="item_id"
                    class="inventory-item"
                  >
                    <span class="inventory-target">[{{ item_id }}] {{ getItemDisplayName(item_id) }}</span> :
                    <input
                      :value="quantity"
                      type="number"
                      placeholder="數量"
                      class="inventory-input"
                      min="1"
                      @input="
                        updateInventory(character_id, item_id, parseInt(($event.target as HTMLInputElement).value) || 1)
                      "
                    />
                    <button class="remove-inventory-btn" @click="removeInventory(character_id, item_id)">×</button>
                  </div>
                  <div class="add-inventory">
                    <select v-model="character_data.selected_inventory_item" class="inventory-select">
                      <option value="">選擇物品</option>
                      <option v-for="[id, data] in getAllItems()" :key="id" :value="id">
                        {{ `${id}: ${data.name || '未知物品'}` }}
                      </option>
                    </select>
                    <input
                      v-model.number="character_data.selected_inventory_quantity"
                      type="number"
                      placeholder="數量"
                      class="quantity-input"
                      min="1"
                      :disabled="!character_data.selected_inventory_item"
                    />
                    <button
                      class="add-inventory-btn"
                      :disabled="!character_data.selected_inventory_item || !character_data.selected_inventory_quantity"
                      @click="addInventory(character_id)"
                    >
                      添加物品
                    </button>
                  </div>
                </div>
                <div v-if="character_data.generated_inventory" class="generated-result">
                  <label>生成結果：</label>
                  <div class="generated-text">{{ character_data.generated_inventory }}</div>
                  <button
                    class="replace-btn"
                    @click="applyGeneratedField(character_id, '所持物', character_data.generated_inventory)"
                  >
                    使用
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 生成要求區域 -->
          <div class="section">
            <h4>生成要求</h4>
            <div class="form-grid">
              <div class="input-group full-width">
                <label>對AI生成的要求</label>
                <textarea
                  v-model="character_data.generation_requirement"
                  placeholder="對AI生成的要求..."
                  class="text-area"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 生成按鈕區域 -->
          <div class="action-section">
            <button
              class="generate-btn"
              :disabled="!hasWorldInfo || is_generating.get(character_id)"
              @click="generateCharacterProfile(character_id)"
            >
              <span v-if="is_generating.get(character_id)" class="loading-spinner"></span>
              {{
                is_generating.get(character_id)
                  ? '生成中...'
                  : hasWorldInfo
                    ? '生成未填寫的字段'
                    : '請先完成世界背景設定'
              }}
            </button>
            <button
              class="apply-all-btn"
              :disabled="!hasGeneratedResults(character_data)"
              @click="applyAllGeneratedResults(character_id)"
            >
              應用全部
            </button>
          </div>
        </div>
      </FoldBarComponent>
    </div>

    <!-- 添加角色按鈕 -->
    <div class="add-character-section">
      <button class="add-character-btn" @click="addNewCharacter">
        <span>+ 添加角色</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import FoldBarComponent from '../common_elements/fold_bar.vue';

// 通用數字字段處理函數
const getNumberValue = (data: any, field: string): string => {
  const value = data[field] as number | null;
  return value?.toString() || '';
};

const setNumberValue = (data: any, field: string, value: string) => {
  if (value === '' || value.trim() === '') {
    data[field] = null;
  } else {
    const num = parseInt(value);
    data[field] = isNaN(num) ? null : num;
  }
};

// 通用生成結果應用函數
const applyGeneratedField = (character_id: string, field_name: string, generated_value: string) => {
  const character_data = chat_characters.value.get(character_id);
  if (!character_data) return;

  const fieldMappings: Record<string, { field: keyof CharacterData; parser?: (val: string) => any }> = {
    姓氏: { field: '姓氏' },
    名字: { field: '名字' },
    年齡: { field: '年齡', parser: val => parseInt(val) || null },
    性別: { field: '性別' },
    身份: { field: '身份' },
    身高: { field: '身高', parser: val => parseInt(val) || null },
    體重: { field: '體重', parser: val => parseInt(val) || null },
    胸圍: { field: '胸圍', parser: val => parseInt(val) || null },
    罩杯: { field: '罩杯' },
    腰圍: { field: '腰圍', parser: val => parseInt(val) || null },
    臀圍: { field: '臀圍', parser: val => parseInt(val) || null },
    髮型: { field: '髮型' },
    樣貌: { field: '樣貌' },
    衣著: { field: '衣著' },
    簡介: { field: '簡介' },
    性格: { field: '性格' },
    愛好: { field: '愛好' },
    金錢: { field: '金錢', parser: val => parseInt(val) || null },
    心情: { field: '心情', parser: val => parseInt(val) || null },
    性慾: { field: '性慾', parser: val => parseInt(val) || null },
    生日月份: { field: '生日月份', parser: val => parseInt(val) || null },
    生日日期: { field: '生日日期', parser: val => parseInt(val) || null },
    其他重要資訊: { field: '其他重要資訊' },
  };

  const mapping = fieldMappings[field_name];
  if (mapping) {
    const parsedValue = mapping.parser ? mapping.parser(generated_value) : generated_value;
    (character_data as any)[mapping.field] = parsedValue;
    (character_data as any)[`generated_${field_name}`] = '';
  } else if (field_name === '生日') {
    // 特殊處理生日字段
    const parts = generated_value.split('-');
    if (parts.length === 2) {
      character_data.生日月份 = parseInt(parts[0]) || null;
      character_data.生日日期 = parseInt(parts[1]) || null;
      character_data.generated_birthday_month = '';
      character_data.generated_birthday_day = '';
    }
  } else if (field_name === '關係') {
    applyRelationGenerated(character_data, generated_value);
  } else if (field_name === '友好度') {
    applyFriendshipGenerated(character_data, generated_value);
  } else if (field_name === '愛情度') {
    applyLoveGenerated(character_data, generated_value);
  } else if (field_name === '所持物') {
    applyInventoryGenerated(character_data, generated_value);
  }

  // 更新 Map
  chat_characters.value.set(character_id, { ...character_data });
  saveCharacterData(character_id);
};

// 應用關係生成結果
const applyRelationGenerated = (character_data: CharacterData, generated_value: string) => {
  if (!character_data.關係) character_data.關係 = new Map();
  const relationString = generated_value.replace(/^["']|["']$/g, '');
  if (relationString.startsWith('[') && relationString.endsWith(']')) {
    const relationsContent = relationString.slice(1, -1);
    const relationPairs = relationsContent.split(',').map(pair => pair.trim());
    for (const pair of relationPairs) {
      const colonIndex = pair.indexOf(':');
      if (colonIndex > 0) {
        const targetId = pair
          .substring(0, colonIndex)
          .replace(/^["']|["']$/g, '')
          .trim();
        const relationDesc = pair
          .substring(colonIndex + 1)
          .replace(/^["']|["']$/g, '')
          .trim();
        if (targetId && relationDesc) {
          character_data.關係.set(targetId, relationDesc);
        }
      }
    }
  } else if (character_data.selected_relation_target) {
    character_data.關係.set(character_data.selected_relation_target, generated_value);
  }
  character_data.generated_relationship = '';
};

// 應用友好度生成結果
const applyFriendshipGenerated = (character_data: CharacterData, generated_value: string) => {
  if (!character_data.友好度) character_data.友好度 = new Map();
  const friendshipString = generated_value.replace(/^["']|["']$/g, '');
  if (friendshipString.startsWith('[') && friendshipString.endsWith(']')) {
    const friendshipContent = friendshipString.slice(1, -1);
    const friendshipPairs = friendshipContent.split(',').map(pair => pair.trim());
    for (const pair of friendshipPairs) {
      const colonIndex = pair.indexOf(':');
      if (colonIndex > 0) {
        const targetId = pair
          .substring(0, colonIndex)
          .replace(/^["']|["']$/g, '')
          .trim();
        const friendshipValue = parseInt(
          pair
            .substring(colonIndex + 1)
            .replace(/^["']|["']$/g, '')
            .trim(),
        );
        if (targetId && !isNaN(friendshipValue)) {
          character_data.友好度.set(targetId, friendshipValue);
        }
      }
    }
  }
  character_data.generated_friendship = '';
};

// 應用愛情度生成結果
const applyLoveGenerated = (character_data: CharacterData, generated_value: string) => {
  if (!character_data.愛情度) character_data.愛情度 = new Map();
  const loveString = generated_value.replace(/^["']|["']$/g, '');
  if (loveString.startsWith('[') && loveString.endsWith(']')) {
    const loveContent = loveString.slice(1, -1);
    const lovePairs = loveContent.split(',').map(pair => pair.trim());
    for (const pair of lovePairs) {
      const colonIndex = pair.indexOf(':');
      if (colonIndex > 0) {
        const targetId = pair
          .substring(0, colonIndex)
          .replace(/^["']|["']$/g, '')
          .trim();
        const loveValue = parseInt(
          pair
            .substring(colonIndex + 1)
            .replace(/^["']|["']$/g, '')
            .trim(),
        );
        if (targetId && !isNaN(loveValue)) {
          character_data.愛情度.set(targetId, loveValue);
        }
      }
    }
  }
  character_data.generated_love = '';
};

// 應用所持物生成結果
const applyInventoryGenerated = (character_data: CharacterData, generated_value: string) => {
  if (!character_data.所持物) character_data.所持物 = new Map();
  const inventoryString = generated_value.replace(/^["']|["']$/g, '');
  if (inventoryString.startsWith('[') && inventoryString.endsWith(']')) {
    const inventoryContent = inventoryString.slice(1, -1);
    const inventoryPairs = inventoryContent.split(',').map(pair => pair.trim());
    for (const pair of inventoryPairs) {
      const colonIndex = pair.indexOf(':');
      if (colonIndex > 0) {
        const itemId = pair
          .substring(0, colonIndex)
          .replace(/^["']|["']$/g, '')
          .trim();
        const quantity = parseInt(
          pair
            .substring(colonIndex + 1)
            .replace(/^["']|["']$/g, '')
            .trim(),
        );
        if (itemId && !isNaN(quantity) && quantity > 0) {
          character_data.所持物.set(itemId, quantity);
        }
      }
    }
  }
  character_data.generated_inventory = '';
};

// 角色資料結構
interface CharacterData {
  姓氏?: string;
  名字?: string;
  年齡?: number | null;
  性別?: string;
  身份?: string;
  身高?: number | null;
  體重?: number | null;
  胸圍?: number | null;
  罩杯?: string;
  腰圍?: number | null;
  臀圍?: number | null;
  髮型?: string;
  樣貌?: string;
  衣著?: string;
  簡介?: string;
  性格?: string;
  愛好?: string;
  金錢?: number | null;
  心情?: number | null;
  性慾?: number | null;
  生日月份?: number | null;
  生日日期?: number | null;
  其他重要資訊?: string;
  關係?: Map<string, string>;
  selected_relation_target?: string;
  友好度?: Map<string, number>;
  愛情度?: Map<string, number>;
  selected_friendship_target?: string;
  selected_love_target?: string;
  所持物?: Map<string, number>;
  selected_inventory_item?: string;
  selected_inventory_quantity?: number;
  generation_requirement?: string;
  // 生成結果
  generated_surname?: string;
  generated_name?: string;
  generated_age?: string;
  generated_gender?: string;
  generated_identity?: string;
  generated_height?: string;
  generated_weight?: string;
  generated_chest_size?: string;
  generated_cup_size?: string;
  generated_waist_size?: string;
  generated_hips_size?: string;
  generated_hairstyle?: string;
  generated_appearance?: string;
  generated_clothes?: string;
  generated_introduction?: string;
  generated_personality?: string;
  generated_favourite?: string;
  generated_money?: string;
  generated_mood?: string;
  generated_sexuality?: string;
  generated_birthday_month?: string;
  generated_birthday_day?: string;
  generated_birthday?: string;
  generated_extra_information?: string;
  generated_relationship?: string;
  generated_selected_relation_target?: string;
  generated_friendship?: string;
  generated_love?: string;
  generated_inventory?: string;
}

// 獲取聊天變數中的角色資料
const chat_characters = ref<Map<string, CharacterData>>(new Map());

// 生成狀態
const is_generating = ref<Map<string, boolean>>(new Map());

// 獲取除了 c1 之外的其他角色
const other_characters = computed(() => {
  const characters = new Map<string, CharacterData>();
  for (const [char_id, char_data] of chat_characters.value) {
    if (char_id !== 'c1') {
      characters.set(char_id, char_data);
    }
  }
  return characters;
});

// 為模板提供 entries 形式的數據
const other_characters_entries = computed(() => {
  return Array.from(other_characters.value.entries());
});

// 獲取所有其他角色（包括用戶）
const getAllOtherCharacters = (current_character_id: string) => {
  const all = new Map(chat_characters.value);
  // 添加用戶
  const variables = getVariables({ type: 'chat' });
  const userChar = variables.characters?.c1;
  if (userChar && !all.has('c1')) {
    all.set('c1', reactive(userChar as CharacterData));
  }
  return Array.from(all.entries()).filter(([id]) => id !== current_character_id);
};

// 獲取所有物品
const getAllItems = () => {
  const all = new Map();
  const variables = getVariables({ type: 'chat' });
  if (variables?.items) {
    for (const [item_id, item_data] of Object.entries(variables.items)) {
      all.set(item_id, reactive(item_data as any));
    }
  }
  return Array.from(all.entries());
};

// 獲取物品顯示名稱
const getItemDisplayName = (item_id: string): string => {
  const variables = getVariables({ type: 'chat' });
  const item = variables.items?.[item_id];
  if (item) {
    return item.name || '未知物品';
  }
  return '未知物品';
};

// 獲取角色顯示名稱
const getCharacterDisplayName = (character_data: CharacterData): string => {
  const fullName = `${character_data?.姓氏 || ''}${character_data?.名字 || ''}`.trim();
  return fullName || '未知角色';
};

// 根據ID獲取角色顯示名稱
const getCharacterDisplayNameById = (character_id: string): string => {
  const variables = getVariables({ type: 'chat' });
  const char = variables.characters?.[character_id];
  if (char) {
    const fullName = `${char.姓氏 || ''}${char.名字 || ''}`.trim();
    return fullName || '未知角色';
  }
  return '未知角色';
};

// 檢查是否有任何生成結果
const hasGeneratedResults = (character_data: CharacterData): boolean => {
  return !!(
    character_data?.generated_surname ||
    character_data?.generated_name ||
    character_data?.generated_age ||
    character_data?.generated_gender ||
    character_data?.generated_identity ||
    character_data?.generated_height ||
    character_data?.generated_weight ||
    character_data?.generated_chest_size ||
    character_data?.generated_cup_size ||
    character_data?.generated_waist_size ||
    character_data?.generated_hips_size ||
    character_data?.generated_hairstyle ||
    character_data?.generated_appearance ||
    character_data?.generated_clothes ||
    character_data?.generated_introduction ||
    character_data?.generated_personality ||
    character_data?.generated_favourite ||
    character_data?.generated_money ||
    character_data?.generated_mood ||
    character_data?.generated_sexuality ||
    character_data?.generated_birthday_month ||
    character_data?.generated_birthday_day ||
    character_data?.generated_extra_information ||
    character_data?.generated_relationship ||
    character_data?.generated_friendship ||
    character_data?.generated_love ||
    character_data?.generated_inventory
  );
};

// 檢查角色資料是否完整填寫
const isCharacterComplete = (character_data: CharacterData): boolean => {
  // 檢查關係：如果關係 Map 不存在則不完整，如果存在但有空值則不完整，如果為空 Map 則完整
  const relationsComplete = (() => {
    if (!(character_data?.關係 instanceof Map)) {
      return false;
    }
    // 如果關係 Map 為空，則認為完整
    if (character_data.關係.size === 0) {
      return true;
    }
    // 如果有關係，檢查所有關係的值是否都已設置（不為空）
    for (const [_target_id, relation_desc] of character_data.關係) {
      if (!relation_desc || !relation_desc.trim()) {
        return false;
      }
    }
    return true;
  })();

  return !!(
    character_data?.姓氏?.trim() &&
    character_data?.名字?.trim() &&
    character_data?.年齡 !== null &&
    character_data?.性別?.trim() &&
    character_data?.身份?.trim() &&
    character_data?.身高 !== null &&
    character_data?.體重 !== null &&
    character_data?.胸圍 !== null &&
    character_data?.罩杯?.trim() &&
    character_data?.腰圍 !== null &&
    character_data?.臀圍 !== null &&
    character_data?.髮型?.trim() &&
    character_data?.樣貌?.trim() &&
    character_data?.衣著?.trim() &&
    character_data?.簡介?.trim() &&
    character_data?.性格?.trim() &&
    character_data?.愛好?.trim() &&
    character_data?.金錢 !== null &&
    character_data?.心情 !== null &&
    character_data?.性慾 !== null &&
    character_data?.生日月份 !== null &&
    character_data?.生日日期 !== null &&
    character_data?.其他重要資訊?.trim() &&
    relationsComplete
  );
};

// 檢查 world_info 是否存在
const hasWorldInfo = computed(() => {
  try {
    const variables = getVariables({ type: 'chat' });
    return !!variables?.world_info?.trim();
  } catch {
    return false;
  }
});

// 初始化角色數據的生成結果欄位
const initializeGeneratedFields = (character: CharacterData) => {
  const generatedFields = [
    'generated_surname',
    'generated_name',
    'generated_age',
    'generated_gender',
    'generated_identity',
    'generated_height',
    'generated_weight',
    'generated_chest_size',
    'generated_cup_size',
    'generated_waist_size',
    'generated_hips_size',
    'generated_hairstyle',
    'generated_appearance',
    'generated_clothes',
    'generated_introduction',
    'generated_personality',
    'generated_favourite',
    'generated_money',
    'generated_mood',
    'generated_sexuality',
    'generated_birthday_month',
    'generated_birthday_day',
    'generated_extra_information',
    'generated_relationship',
    'generated_selected_relation_target',
    'generated_friendship',
    'generated_love',
    'generated_inventory',
  ];

  generatedFields.forEach(field => {
    if (!(character as any)[field]) {
      (character as any)[field] = '';
    }
  });

  if (!character.generation_requirement) {
    character.generation_requirement = '';
  }
};

// 初始化角色的 Map 字段
const initializeMapFields = (character: CharacterData) => {
  // 從聊天變數中的 object 格式轉換為 Map
  if (character.關係 && typeof character.關係 === 'object' && !(character.關係 instanceof Map)) {
    character.關係 = new Map(Object.entries(character.關係));
  } else if (!character.關係) {
    character.關係 = new Map();
  }

  if (character.友好度 && typeof character.友好度 === 'object' && !(character.友好度 instanceof Map)) {
    character.友好度 = new Map(Object.entries(character.友好度));
  } else if (!character.友好度) {
    character.友好度 = new Map();
  }

  if (character.愛情度 && typeof character.愛情度 === 'object' && !(character.愛情度 instanceof Map)) {
    character.愛情度 = new Map(Object.entries(character.愛情度));
  } else if (!character.愛情度) {
    character.愛情度 = new Map();
  }

  if (character.所持物 && typeof character.所持物 === 'object' && !(character.所持物 instanceof Map)) {
    character.所持物 = new Map(Object.entries(character.所持物));
  } else if (!character.所持物) {
    character.所持物 = new Map();
  }

  // 確保選擇字段有默認值
  if (!character.selected_relation_target) {
    character.selected_relation_target = '';
  }
  if (!character.selected_friendship_target) {
    character.selected_friendship_target = '';
  }
  if (!character.selected_love_target) {
    character.selected_love_target = '';
  }
  if (!character.selected_inventory_item) {
    character.selected_inventory_item = '';
  }
  if (character.selected_inventory_quantity === undefined || character.selected_inventory_quantity === null) {
    character.selected_inventory_quantity = 1;
  }
};

// 載入聊天變數中的角色資料
const loadChatCharacters = () => {
  try {
    const variables = getVariables({ type: 'chat' });

    if (variables?.characters) {
      const characters_map = new Map<string, CharacterData>();
      for (const [char_id, char_data] of Object.entries(variables.characters)) {
        const character = reactive(char_data as CharacterData);
        initializeGeneratedFields(character);
        initializeMapFields(character);
        characters_map.set(char_id, character);
      }
      chat_characters.value = characters_map;
    } else {
      chat_characters.value = new Map();
    }
  } catch (error) {
    console.error('載入角色資料失敗:', error);
    chat_characters.value = new Map();
  }

  // 載入生成結果
  try {
    for (const [char_id, character] of chat_characters.value) {
      const storedGenerated = localStorage.getItem(`character_profile_generated_${char_id}`);
      if (storedGenerated) {
        Object.assign(character, JSON.parse(storedGenerated));
      }
    }
  } catch (error) {
    console.error('Failed to load generated character profiles from localStorage:', error);
  }
};

// 保存角色資料
const saveCharacterData = (character_id: string) => {
  try {
    // 獲取當前聊天變數
    const variables = getVariables({ type: 'chat' });
    const characters = { ...(variables.characters || {}) };

    // 獲取當前角色資料
    const character_data = chat_characters.value.get(character_id);
    if (!character_data) return;

    // 創建角色資料（不包含生成結果欄位）
    const clean_character_data: any = {
      姓氏: character_data.姓氏 || '',
      名字: character_data.名字 || '',
      年齡: character_data.年齡,
      性別: character_data.性別 || '',
      身份: character_data.身份 || '',
      身高: character_data.身高,
      體重: character_data.體重,
      胸圍: character_data.胸圍,
      罩杯: character_data.罩杯 || '',
      腰圍: character_data.腰圍,
      臀圍: character_data.臀圍,
      髮型: character_data.髮型 || '',
      樣貌: character_data.樣貌 || '',
      衣著: character_data.衣著 || '',
      簡介: character_data.簡介 || '',
      性格: character_data.性格 || '',
      愛好: character_data.愛好 || '',
      金錢: character_data.金錢,
      心情: character_data.心情,
      性慾: character_data.性慾,
      生日月份: character_data.生日月份,
      生日日期: character_data.生日日期,
      其他重要資訊: character_data.其他重要資訊 || '',
      關係: Object.fromEntries(character_data.關係 || new Map()),
      友好度: Object.fromEntries(character_data.友好度 || new Map()),
      愛情度: Object.fromEntries(character_data.愛情度 || new Map()),
      所持物: Object.fromEntries(character_data.所持物 || new Map()),
    };

    // 更新角色資料
    characters[character_id] = clean_character_data;

    // 保存到聊天變數
    variables['characters'] = characters;
    replaceVariables(variables, { type: 'chat' });
  } catch (error) {
    console.error(`保存角色 ${character_id} 資料失敗:`, error);
  }
};

// 應用所有生成結果
const applyAllGeneratedResults = (character_id: string) => {
  const character_data = chat_characters.value.get(character_id);
  if (!character_data) return;

  // 定義字段映射
  const fieldMappings = [
    { generated: 'generated_surname', field: '姓氏', parser: (val: string) => val },
    { generated: 'generated_name', field: '名字', parser: (val: string) => val },
    { generated: 'generated_age', field: '年齡', parser: (val: string) => parseInt(val) || null },
    { generated: 'generated_gender', field: '性別', parser: (val: string) => val },
    { generated: 'generated_identity', field: '身份', parser: (val: string) => val },
    { generated: 'generated_height', field: '身高', parser: (val: string) => parseInt(val) || null },
    { generated: 'generated_weight', field: '體重', parser: (val: string) => parseInt(val) || null },
    { generated: 'generated_chest_size', field: '胸圍', parser: (val: string) => parseInt(val) || null },
    { generated: 'generated_cup_size', field: '罩杯', parser: (val: string) => val },
    { generated: 'generated_waist_size', field: '腰圍', parser: (val: string) => parseInt(val) || null },
    { generated: 'generated_hips_size', field: '臀圍', parser: (val: string) => parseInt(val) || null },
    { generated: 'generated_hairstyle', field: '髮型', parser: (val: string) => val },
    { generated: 'generated_appearance', field: '樣貌', parser: (val: string) => val },
    { generated: 'generated_clothes', field: '衣著', parser: (val: string) => val },
    { generated: 'generated_introduction', field: '簡介', parser: (val: string) => val },
    { generated: 'generated_personality', field: '性格', parser: (val: string) => val },
    { generated: 'generated_favourite', field: '愛好', parser: (val: string) => val },
    { generated: 'generated_money', field: '金錢', parser: (val: string) => parseInt(val) || null },
    { generated: 'generated_mood', field: '心情', parser: (val: string) => parseInt(val) || null },
    { generated: 'generated_sexuality', field: '性慾', parser: (val: string) => parseInt(val) || null },
    { generated: 'generated_birthday_month', field: '生日月份', parser: (val: string) => parseInt(val) || null },
    { generated: 'generated_birthday_day', field: '生日日期', parser: (val: string) => parseInt(val) || null },
    { generated: 'generated_extra_information', field: '其他重要資訊', parser: (val: string) => val },
  ];

  // 應用簡單字段
  fieldMappings.forEach(({ generated, field, parser }) => {
    const generatedValue = (character_data as any)[generated];
    if (generatedValue) {
      (character_data as any)[field] = parser(generatedValue);
      (character_data as any)[generated] = '';
    }
  });

  // 應用複雜字段
  if (character_data.generated_relationship) {
    applyRelationGenerated(character_data, character_data.generated_relationship);
  }
  if (character_data.generated_friendship) {
    applyFriendshipGenerated(character_data, character_data.generated_friendship);
  }
  if (character_data.generated_love) {
    applyLoveGenerated(character_data, character_data.generated_love);
  }
  if (character_data.generated_inventory) {
    applyInventoryGenerated(character_data, character_data.generated_inventory);
  }

  // 更新 Map
  chat_characters.value.set(character_id, { ...character_data });

  // 保存資料
  saveCharacterData(character_id);

  // 清除 localStorage
  try {
    localStorage.removeItem(`character_profile_generated_${character_id}`);
  } catch (error) {
    console.error(`Failed to remove generated character profile for ${character_id} from localStorage:`, error);
  }
};

const castObjectToString = (object: Record<string, any>): string => {
  return (
    '[' +
    Object.entries(object)
      .map(([key, value]) => (typeof value === 'string' ? `'${key}':'${value}'` : `'${key}':${value}`))
      .join(', ') +
    ']'
  );
};

// 獲取角色生成提示
const getCharacterPrompt = (character_data: CharacterData): string => {
  let character_prompt = `請根據世界背景資訊、生成要求及已有角色資料，為以下角色完善角色資料設定：\n\n`;
  character_prompt += `姓氏：${character_data.姓氏 || ''}\n`;
  character_prompt += `名字：${character_data.名字 || ''}\n`;
  character_prompt += `年齡：${character_data.年齡 || ''}\n`;
  character_prompt += `性別：${character_data.性別 || ''}\n`;
  character_prompt += `身份：${character_data.身份 || ''}\n`;
  character_prompt += `身高：${character_data.身高 || ''}\n`;
  character_prompt += `體重：${character_data.體重 || ''}\n`;
  character_prompt += `胸圍：${character_data.胸圍 || ''}\n`;
  character_prompt += `罩杯：${character_data.罩杯 || ''}\n`;
  character_prompt += `腰圍：${character_data.腰圍 || ''}\n`;
  character_prompt += `臀圍：${character_data.臀圍 || ''}\n`;
  character_prompt += `髮型：${character_data.髮型 || ''}\n`;
  character_prompt += `樣貌：${character_data.樣貌 || ''}\n`;
  character_prompt += `衣著：${character_data.衣著 || ''}\n`;
  character_prompt += `簡介：${character_data.簡介 || ''}\n`;
  character_prompt += `性格：${character_data.性格 || ''}\n`;
  character_prompt += `愛好：${character_data.愛好 || ''}\n`;
  character_prompt += `金錢：${character_data.金錢 || ''}\n`;
  character_prompt += `心情：${character_data.心情 || ''}\n`;
  character_prompt += `性慾：${character_data.性慾 || ''}\n`;
  character_prompt += `生日月份：${character_data.生日月份 || ''}\n`;
  character_prompt += `生日日期：${character_data.生日日期 || ''}\n`;
  character_prompt += `其他重要資訊：${character_data.其他重要資訊 || ''}\n`;
  character_prompt += `關係：${castObjectToString(Object.fromEntries(character_data.關係 || new Map()))}\n`;
  character_prompt += `友好度：${castObjectToString(Object.fromEntries(character_data.友好度 || new Map()))}\n`;
  character_prompt += `愛情度：${castObjectToString(Object.fromEntries(character_data.愛情度 || new Map()))}\n`;
  character_prompt += `所持物：${castObjectToString(Object.fromEntries(character_data.所持物 || new Map()))}\n`;
  return character_prompt;
};

// 獲取生成前世界背景系統提示
const getPreWorldInfoSystemPrompt = (): string => {
  const variable = getVariables({ type: 'chat' });
  const world_info: string = variable.world_info;
  let character_description = getCharData('current')!.description;
  character_description = character_description.replace('{{getvar::world_info}}', world_info);
  let pre_world_info_system_prompt =
    '你是一個專業的角色設計助手，擅長創造豐富多彩的角色設定。請根據提供的世界背景及生成要求，為角色完善資料。\n';
  pre_world_info_system_prompt += '\n';
  pre_world_info_system_prompt += '<世界背景>\n';
  return pre_world_info_system_prompt;
};

const getUserStatusPrompt = (): string => {
  const variables = getVariables({ type: 'chat' });
  const user_state = variables['characters']['c1'];
  const user_name = `${user_state.姓氏}${user_state.名字}`;
  let user_status_prompt = `<${user_name}Status>\n`;
  user_status_prompt += `id：c1\n`;
  user_status_prompt += `  姓氏：${user_state.姓氏 || ''}\n`;
  user_status_prompt += `  名字：${user_state.名字 || ''}\n`;
  user_status_prompt += `  年齡：${user_state.年齡 || ''}\n`;
  user_status_prompt += `  性別：${user_state.性別 || ''}\n`;
  user_status_prompt += `  身份：${user_state.身份 || ''}\n`;
  user_status_prompt += `  身高：${user_state.身高 || ''}\n`;
  user_status_prompt += `  體重：${user_state.體重 || ''}\n`;
  user_status_prompt += `  胸圍：${user_state.胸圍 || ''}\n`;
  user_status_prompt += `  罩杯：${user_state.罩杯 || ''}\n`;
  user_status_prompt += `  腰圍：${user_state.腰圍 || ''}\n`;
  user_status_prompt += `  臀圍：${user_state.臀圍 || ''}\n`;
  user_status_prompt += `  髮型：${user_state.髮型 || ''}\n`;
  user_status_prompt += `  樣貌：${user_state.樣貌 || ''}\n`;
  user_status_prompt += `  衣著：${user_state.衣著 || ''}\n`;
  user_status_prompt += `  簡介：${user_state.簡介 || ''}\n`;
  user_status_prompt += `  性格：${user_state.性格 || ''}\n`;
  user_status_prompt += `  愛好：${user_state.愛好 || ''}\n`;
  user_status_prompt += `  金錢：${user_state.金錢 || ''}\n`;
  user_status_prompt += `  生日月份：${user_state.生日月份 || ''}\n`;
  user_status_prompt += `  生日日期：${user_state.生日日期 || ''}\n`;
  user_status_prompt += `  其他重要資訊：${user_state.其他重要資訊 || ''}\n`;
  user_status_prompt += `  關係：${castObjectToString(user_state.關係)}\n`;
  user_status_prompt += `  友好度：${castObjectToString(user_state.友好度)}\n`;
  user_status_prompt += `  愛情度：${castObjectToString(user_state.愛情度)}\n`;
  user_status_prompt += `</${user_name}Status>`;
  return user_status_prompt;
};

const getCharacterStatusPrompt = (character_id: string): string => {
  const variables = getVariables({ type: 'chat' });
  const characters = variables['characters'];
  if (characters === undefined) return '';
  let character_status_prompt = `<CharacterStatus>\n`;
  for (const [key, character_state] of Object.entries(characters) as [string, any]) {
    if (key === 'c1' || key === character_id) continue;
    character_status_prompt += `id：${key}\n`;
    character_status_prompt += `  姓氏：${character_state.姓氏 || ''}\n`;
    character_status_prompt += `  名字：${character_state.名字 || ''}\n`;
    character_status_prompt += `  年齡：${character_state.年齡 || ''}\n`;
    character_status_prompt += `  性別：${character_state.性別 || ''}\n`;
    character_status_prompt += `  身份：${character_state.身份 || ''}\n`;
    character_status_prompt += `  身高：${character_state.身高 || ''}\n`;
    character_status_prompt += `  體重：${character_state.體重 || ''}\n`;
    character_status_prompt += `  胸圍：${character_state.胸圍 || ''}\n`;
    character_status_prompt += `  罩杯：${character_state.罩杯 || ''}\n`;
    character_status_prompt += `  腰圍：${character_state.腰圍 || ''}\n`;
    character_status_prompt += `  臀圍：${character_state.臀圍 || ''}\n`;
    character_status_prompt += `  髮型：${character_state.髮型 || ''}\n`;
    character_status_prompt += `  樣貌：${character_state.樣貌 || ''}\n`;
    character_status_prompt += `  衣著：${character_state.衣著 || ''}\n`;
    character_status_prompt += `  簡介：${character_state.簡介 || ''}\n`;
    character_status_prompt += `  性格：${character_state.性格 || ''}\n`;
    character_status_prompt += `  愛好：${character_state.愛好 || ''}\n`;
    character_status_prompt += `  金錢：${character_state.金錢 || ''}\n`;
    character_status_prompt += `  心情：${character_state.心情 || ''}\n`;
    character_status_prompt += `  性慾：${character_state.性慾 || ''}\n`;
    character_status_prompt += `  生日月份：${character_state.生日月份 || ''}\n`;
    character_status_prompt += `  生日日期：${character_state.生日日期 || ''}\n`;
    character_status_prompt += `  其他重要資訊：${character_state.其他重要資訊 || ''}\n`;
    character_status_prompt += `  關係：${castObjectToString(character_state.關係)}\n`;
    character_status_prompt += `  友好度：${castObjectToString(character_state.友好度)}\n`;
    character_status_prompt += `  愛情度：${castObjectToString(character_state.愛情度)}\n\n`;
  }
  character_status_prompt += `</CharacterStatus>`;
  return character_status_prompt;
};

const getItemTablePrompt = (): string => {
  let item_table_prompt = '<ItemTable>\n';
  item_table_prompt += '|id|名稱|描述|價值|\n';
  item_table_prompt += '|---|---|---|---|\n';
  const variables = getVariables({ type: 'chat' });
  const items = variables['items'];
  if (items === undefined) return '';
  for (const [key, item] of Object.entries(items) as [string, any]) {
    item_table_prompt += `|${key}|${item.name}|${item.description}|${item.value}|\n`;
  }
  item_table_prompt += '</ItemTable>';
  return item_table_prompt;
};

const getExtraWorldInfoPrompt = (): string => {
  let extra_world_info_prompt = '';
  const variables = getVariables({ type: 'chat' });
  const extra_world_infos = variables['extra_world_info'];
  if (extra_world_infos === undefined) return '';
  for (const extra_world_info of Array.from(extra_world_infos) as { name: string; content: string }[]) {
    if (extra_world_info.name === '' || extra_world_info.content === '') continue;
    extra_world_info_prompt += `<${extra_world_info.name}>\n`;
    extra_world_info_prompt += `${extra_world_info.content}\n`;
    extra_world_info_prompt += `</${extra_world_info.name}>\n`;
    extra_world_info_prompt += '\n';
  }
  return extra_world_info_prompt;
};

// 獲取生成後世界背景系統提示
const getPostWorldInfoSystemPrompt = (character_id: string, character_data: CharacterData): string => {
  let post_world_info_system_prompt = '\n</世界背景>\n';
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getUserStatusPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getCharacterStatusPrompt(character_id)}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getItemTablePrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += `${getExtraWorldInfoPrompt()}\n`;
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<生成要求>\n';
  post_world_info_system_prompt += `${character_data.generation_requirement || '無特殊要求'}\n`;
  post_world_info_system_prompt += '</生成要求>\n';
  post_world_info_system_prompt += '\n';
  post_world_info_system_prompt += '<example>\n';
  post_world_info_system_prompt +=
    '# The following is an example of user input and expected output. Please strictly follow the style and format to generate the output. Output anything other than this format is prohibited.\n';
  post_world_info_system_prompt += `姓氏：string\n`;
  post_world_info_system_prompt += `名字：string\n`;
  post_world_info_system_prompt += `年齡：number\n`;
  post_world_info_system_prompt += `性別：'男' | '女' | '不明'\n`;
  post_world_info_system_prompt += `身份：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `身高：number\n`;
  post_world_info_system_prompt += `體重：number\n`;
  post_world_info_system_prompt += `胸圍：number\n`;
  post_world_info_system_prompt += `罩杯：'Capital Letter' | '不適用'\n`;
  post_world_info_system_prompt += `腰圍：number\n`;
  post_world_info_system_prompt += `臀圍：number\n`;
  post_world_info_system_prompt += `髮型：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `樣貌：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `衣著：'以第三人稱客觀地描述當前身上服裝'\n`;
  post_world_info_system_prompt += `簡介：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `性格：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `愛好：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `金錢：number\n`;
  post_world_info_system_prompt += `心情：number[-100~100]\n`;
  post_world_info_system_prompt += `性慾：number[0~100]\n`;
  post_world_info_system_prompt += `生日月份：number\n`;
  post_world_info_system_prompt += `生日日期：number\n`;
  post_world_info_system_prompt += `其他重要資訊：'以第三人稱客觀地描述'\n`;
  post_world_info_system_prompt += `關係：['id':'對此角色的關係', ...]\n`;
  post_world_info_system_prompt += `友好度：'['id':number[-1000~1000], ...]'\n`;
  post_world_info_system_prompt += `愛情度：'['id':number[1~1000], ...]'\n`;
  post_world_info_system_prompt += `所持物：['item_id':quantity, ...]\n`;
  post_world_info_system_prompt += '</example>\n';
  return post_world_info_system_prompt;
};

// 解析生成結果並填充數據
const parseAndFillGeneratedData = (result: string, character_data: CharacterData) => {
  // 根據換行符分割每一行
  const lines = result.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf('：'); // 注意：這裡是全角冒號
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();

      // 映射到我們的字段
      switch (key) {
        case '姓氏':
          character_data.generated_surname = value.replace(/^["']|["']$/g, '');
          break;
        case '名字':
          character_data.generated_name = value.replace(/^["']|["']$/g, '');
          break;
        case '年齡':
          character_data.generated_age = value.replace(/[^\d]/g, '');
          break;
        case '性別':
          character_data.generated_gender = value.replace(/^["']|["']$/g, '');
          break;
        case '身份':
          character_data.generated_identity = value.replace(/^["']|["']$/g, '');
          break;
        case '身高':
          character_data.generated_height = value.replace(/[^\d]/g, '');
          break;
        case '體重':
          character_data.generated_weight = value.replace(/[^\d]/g, '');
          break;
        case '胸圍':
          character_data.generated_chest_size = value.replace(/[^\d]/g, '');
          break;
        case '罩杯':
          character_data.generated_cup_size = value.replace(/^["']|["']$/g, '');
          break;
        case '腰圍':
          character_data.generated_waist_size = value.replace(/[^\d]/g, '');
          break;
        case '臀圍':
          character_data.generated_hips_size = value.replace(/[^\d]/g, '');
          break;
        case '髮型':
          character_data.generated_hairstyle = value.replace(/^["']|["']$/g, '');
          break;
        case '樣貌':
          character_data.generated_appearance = value.replace(/^["']|["']$/g, '');
          break;
        case '衣著':
          character_data.generated_clothes = value.replace(/^["']|["']$/g, '');
          break;
        case '簡介':
          character_data.generated_introduction = value.replace(/^["']|["']$/g, '');
          break;
        case '性格':
          character_data.generated_personality = value.replace(/^["']|["']$/g, '');
          break;
        case '愛好':
          character_data.generated_favourite = value.replace(/^["']|["']$/g, '');
          break;
        case '金錢':
          character_data.generated_money = value.replace(/[^\d]/g, '');
          break;
        case '心情':
          character_data.generated_mood = value.replace(/[^\d]/g, '');
          break;
        case '性慾':
          character_data.generated_sexuality = value.replace(/[^\d]/g, '');
          break;
        case '生日月份':
          character_data.generated_birthday_month = value.replace(/[^\d]/g, '');
          break;
        case '生日日期':
          character_data.generated_birthday_day = value.replace(/[^\d]/g, '');
          break;
        case '其他重要資訊':
          character_data.generated_extra_information = value.replace(/^["']|["']$/g, '');
          break;
        case '關係':
          character_data.generated_relationship = value.replace(/^["']|["']$/g, '');
          break;
        case '友好度':
          character_data.generated_friendship = value.replace(/^["']|["']$/g, '');
          break;
        case '愛情度':
          character_data.generated_love = value.replace(/^["']|["']$/g, '');
          break;
        case '所持物':
          character_data.generated_inventory = value.replace(/^["']|["']$/g, '');
          break;
      }
    }
  }
};

// 生成角色資料
const generateCharacterProfile = async (character_id: string) => {
  const character_data = chat_characters.value.get(character_id);
  if (!character_data) return;

  // 設置生成狀態
  const current_generating = new Map(is_generating.value);
  current_generating.set(character_id, true);
  is_generating.value = current_generating;

  try {
    const character_prompt = getCharacterPrompt(character_data);
    const pre_world_info_system_prompt = getPreWorldInfoSystemPrompt();
    const post_world_info_system_prompt = getPostWorldInfoSystemPrompt(character_id, character_data);

    const result = await generateRaw({
      user_input: character_prompt,
      ordered_prompts: [
        {
          role: 'system',
          content: pre_world_info_system_prompt,
        },
        'char_description',
        {
          role: 'system',
          content: post_world_info_system_prompt,
        },
        'user_input',
      ],
    });

    // 解析結果並填充到生成字段中
    parseAndFillGeneratedData(result, character_data);

    // 保存生成結果到 localStorage
    try {
      localStorage.setItem(
        `character_profile_generated_${character_id}`,
        JSON.stringify({
          generation_requirement: character_data.generation_requirement,
          generated_surname: character_data.generated_surname,
          generated_name: character_data.generated_name,
          generated_age: character_data.generated_age,
          generated_gender: character_data.generated_gender,
          generated_identity: character_data.generated_identity,
          generated_height: character_data.generated_height,
          generated_weight: character_data.generated_weight,
          generated_chest_size: character_data.generated_chest_size,
          generated_cup_size: character_data.generated_cup_size,
          generated_waist_size: character_data.generated_waist_size,
          generated_hips_size: character_data.generated_hips_size,
          generated_hairstyle: character_data.generated_hairstyle,
          generated_appearance: character_data.generated_appearance,
          generated_clothes: character_data.generated_clothes,
          generated_introduction: character_data.generated_introduction,
          generated_personality: character_data.generated_personality,
          generated_favourite: character_data.generated_favourite,
          generated_money: character_data.generated_money,
          generated_mood: character_data.generated_mood,
          generated_sexuality: character_data.generated_sexuality,
          generated_birthday_month: character_data.generated_birthday_month,
          generated_birthday_day: character_data.generated_birthday_day,
          generated_extra_information: character_data.generated_extra_information,
          generated_relationship: character_data.generated_relationship,
          generated_friendship: character_data.generated_friendship,
          generated_love: character_data.generated_love,
          generated_inventory: character_data.generated_inventory,
        }),
      );
    } catch (error) {
      console.error(`Failed to save generated character profile for ${character_id} to localStorage:`, error);
    }

    // 更新 Map
    chat_characters.value.set(character_id, { ...character_data });
  } catch (error) {
    console.error(`生成角色 ${character_id} 資料失敗:`, error);
    // 設置錯誤消息
    character_data.generated_age = '生成失敗，請重試。';
  } finally {
    // 清除生成狀態
    const current_generating = new Map(is_generating.value);
    current_generating.set(character_id, false);
    is_generating.value = current_generating;
  }
};

// 監聽聊天變數變化
watch(
  () => getVariables({ type: 'chat' }),
  new_variables => {
    if (new_variables?.characters) {
      const charactersMap = new Map<string, CharacterData>();
      for (const [char_id, char_data] of Object.entries(new_variables.characters)) {
        const character = reactive(char_data as CharacterData);
        initializeGeneratedFields(character);
        initializeMapFields(character);
        charactersMap.set(char_id, character);
      }
      chat_characters.value = charactersMap;
    }
  },
  { deep: true },
);

// 監聽角色資料變化並自動保存
watch(
  chat_characters,
  () => {
    // 當角色資料發生變化時，遍歷所有角色並保存
    for (const [char_id] of chat_characters.value.entries()) {
      saveCharacterData(char_id);
    }
  },
  { deep: true },
);

// 監聽 generation_requirement 變化並保存到 localStorage
watch(
  () => chat_characters.value,
  newCharacters => {
    for (const [char_id, character] of newCharacters.entries()) {
      watch(
        () => character.generation_requirement,
        newValue => {
          try {
            const storedGenerated = localStorage.getItem(`character_profile_generated_${char_id}`);
            const generatedData = storedGenerated ? JSON.parse(storedGenerated) : {};
            generatedData.generation_requirement = newValue;
            localStorage.setItem(`character_profile_generated_${char_id}`, JSON.stringify(generatedData));
          } catch (error) {
            console.error(`Failed to save generation_requirement for ${char_id} to localStorage:`, error);
          }
        },
        { immediate: false },
      );
    }
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  loadChatCharacters();
});

// 生成下一個可用的角色ID
const generateNextCharacterId = (): string => {
  const existingIds = Array.from(chat_characters.value.keys());
  let nextId = 2; // 從c2開始

  while (existingIds.includes(`c${nextId}`)) {
    nextId++;
  }

  return `c${nextId}`;
};

// 添加新角色
const addNewCharacter = () => {
  const newCharacterId = generateNextCharacterId();

  // 創建新的空角色資料
  const newCharacter: CharacterData = {
    姓氏: '',
    名字: '',
    年齡: null,
    性別: '',
    身份: '',
    身高: null,
    體重: null,
    胸圍: null,
    罩杯: '',
    腰圍: null,
    臀圍: null,
    髮型: '',
    樣貌: '',
    衣著: '',
    簡介: '',
    性格: '',
    愛好: '',
    金錢: null,
    心情: 50,
    性慾: 0,
    生日月份: null,
    生日日期: null,
    其他重要資訊: '',
    關係: new Map(),
    selected_relation_target: '',
    友好度: new Map(),
    愛情度: new Map(),
    selected_friendship_target: '',
    selected_love_target: '',
    所持物: new Map(),
    selected_inventory_item: '',
    selected_inventory_quantity: 1,
    generation_requirement: '',
    // 生成結果欄位
    generated_surname: '',
    generated_name: '',
    generated_age: '',
    generated_gender: '',
    generated_identity: '',
    generated_height: '',
    generated_weight: '',
    generated_chest_size: '',
    generated_cup_size: '',
    generated_waist_size: '',
    generated_hips_size: '',
    generated_hairstyle: '',
    generated_appearance: '',
    generated_clothes: '',
    generated_introduction: '',
    generated_personality: '',
    generated_favourite: '',
    generated_money: '',
    generated_mood: '',
    generated_sexuality: '',
    generated_birthday_month: '',
    generated_birthday_day: '',
    generated_extra_information: '',
  };

  // 添加到本地狀態
  const reactiveNewCharacter = reactive(newCharacter);
  chat_characters.value.set(newCharacterId, reactiveNewCharacter);

  // 保存到聊天變數
  try {
    const variables = getVariables({ type: 'chat' });
    const characters = variables.characters || {};
    characters[newCharacterId] = {
      姓氏: '',
      名字: '',
      年齡: null,
      性別: '',
      身份: '',
      身高: null,
      體重: null,
      胸圍: null,
      罩杯: '',
      腰圍: null,
      臀圍: null,
      髮型: '',
      樣貌: '',
      衣著: '',
      簡介: '',
      性格: '',
      愛好: '',
      金錢: null,
      心情: 50,
      性慾: 0,
      生日月份: null,
      生日日期: null,
      其他重要資訊: '',
      關係: {},
      友好度: {},
      愛情度: {},
    };
    insertOrAssignVariables({ characters }, { type: 'chat' });
  } catch (error) {
    console.error('Failed to add new character to chat variables:', error);
  }
};

// 通用更新 Map 字段的函數
const updateMapField = (
  character_id: string,
  field: keyof CharacterData,
  target_id: string,
  value: string,
  parser?: (val: string) => any,
) => {
  const character_data = chat_characters.value.get(character_id);
  if (!character_data) return;

  const mapField = (character_data as any)[field] as Map<string, any>;
  if (!mapField) {
    (character_data as any)[field] = new Map();
  }

  const newMap = new Map(mapField);
  const finalValue = parser ? parser(value) : value;
  newMap.set(target_id, finalValue);
  (character_data as any)[field] = newMap;

  chat_characters.value.set(character_id, { ...character_data });
  saveCharacterData(character_id);
};

// 更新關係
const updateRelation = (character_id: string, target_id: string, value: string) =>
  updateMapField(character_id, '關係', target_id, value);

// 更新友好度
const updateFriendship = (character_id: string, target_id: string, value: string) =>
  updateMapField(character_id, '友好度', target_id, value, val => parseInt(val) || 0);

// 更新愛情度
const updateLove = (character_id: string, target_id: string, value: string) =>
  updateMapField(character_id, '愛情度', target_id, value, val => parseInt(val) || 0);

// 通用添加 Map 項目函數
const addMapItem = (
  character_id: string,
  field: keyof CharacterData,
  targetField: keyof CharacterData,
  defaultValue: any,
) => {
  const character_data = chat_characters.value.get(character_id);
  if (!character_data) return;

  const targetId = (character_data as any)[targetField];
  if (!targetId) return;

  const mapField = (character_data as any)[field] as Map<string, any>;
  if (!mapField) {
    (character_data as any)[field] = new Map();
  }

  // 如果已經存在，更新；否則添加
  (character_data as any)[field].set(targetId, defaultValue);
  (character_data as any)[targetField] = '';

  chat_characters.value.set(character_id, { ...character_data });
  saveCharacterData(character_id);
};

// 添加關係
const addRelation = (character_id: string) => addMapItem(character_id, '關係', 'selected_relation_target', '');

// 添加友好度
const addFriendship = (character_id: string) => addMapItem(character_id, '友好度', 'selected_friendship_target', 0);

// 添加愛情度
const addLove = (character_id: string) => addMapItem(character_id, '愛情度', 'selected_love_target', 0);

// 通用移除 Map 項目函數
const removeMapItem = (character_id: string, field: keyof CharacterData, target_id: string) => {
  const character_data = chat_characters.value.get(character_id);
  if (!character_data) return;

  const mapField = (character_data as any)[field] as Map<string, any>;
  if (!mapField) return;

  const newMap = new Map(mapField);
  newMap.delete(target_id);
  (character_data as any)[field] = newMap;

  chat_characters.value.set(character_id, { ...character_data });
  saveCharacterData(character_id);
};

// 移除關係
const removeRelation = (character_id: string, target_id: string) => removeMapItem(character_id, '關係', target_id);

// 移除友好度
const removeFriendship = (character_id: string, target_id: string) => removeMapItem(character_id, '友好度', target_id);

// 移除愛情度
const removeLove = (character_id: string, target_id: string) => removeMapItem(character_id, '愛情度', target_id);

// 更新所持物數量
const updateInventory = (character_id: string, item_id: string, quantity: number) => {
  const character_data = chat_characters.value.get(character_id);
  if (!character_data) return;

  if (!character_data.所持物) {
    character_data.所持物 = new Map();
  }

  // 創建新的 Map 以確保響應式更新
  const newInventory = new Map(character_data.所持物);
  if (quantity > 0) {
    newInventory.set(item_id, quantity);
  } else {
    newInventory.delete(item_id);
  }
  character_data.所持物 = newInventory;

  // 保存資料
  saveCharacterData(character_id);
};

// 添加所持物
const addInventory = (character_id: string) => {
  const character_data = chat_characters.value.get(character_id);
  if (!character_data || !character_data.selected_inventory_item || !character_data.selected_inventory_quantity) return;

  if (!character_data.所持物) {
    character_data.所持物 = new Map();
  }

  // 如果已經存在，更新數量；否則添加
  const currentQuantity = character_data.所持物.get(character_data.selected_inventory_item) || 0;
  character_data.所持物.set(
    character_data.selected_inventory_item,
    currentQuantity + character_data.selected_inventory_quantity,
  );
  character_data.selected_inventory_item = '';
  character_data.selected_inventory_quantity = 1;

  // 保存資料
  saveCharacterData(character_id);
};

// 移除所持物
const removeInventory = (character_id: string, item_id: string) => {
  const character_data = chat_characters.value.get(character_id);
  if (!character_data || !character_data.所持物) return;

  // 創建新的 Map 以確保響應式更新
  const newInventory = new Map(character_data.所持物);
  newInventory.delete(item_id);
  character_data.所持物 = newInventory;

  // 保存資料
  saveCharacterData(character_id);
};

// 移除角色
const removeCharacter = (character_id: string) => {
  // 從本地狀態移除
  chat_characters.value.delete(character_id);

  // 從聊天變數移除
  try {
    const variables = getVariables({ type: 'chat' });
    delete variables.characters[character_id];
    replaceVariables(variables, { type: 'chat' });
  } catch (error) {
    console.error(`Failed to remove character ${character_id} from chat variables:`, error);
  }
};
</script>

<style lang="scss" scoped>
.character-tabs-container {
  color: #e0e0e0;
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;

  h3 {
    color: #007acc;
    margin-bottom: 24px;
    font-size: 20px;
  }
}

// 角色摺疊欄樣式
.character-fold-bar {
  margin-bottom: 16px;

  // 美化摺疊欄按鈕
  :deep(.fold-bar-btn) {
    background: linear-gradient(135deg, #2a2a2a 0%, #333333 100%);
    border: 1px solid #555;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 600;
    color: #e0e0e0;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #333333 0%, #404040 100%);
      border-color: #666;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
  }

  // 美化摺疊欄內容區域
  :deep(.fold-bar-content) {
    background: linear-gradient(135deg, #1a1a1a 0%, #222222 100%);
    border: 1px solid #555;
    border-top: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  // 美化內容文字區域
  :deep(.fold-bar-content-text) {
    padding: 20px;
  }

  // 美化底部收起按鈕
  :deep(.fold-bar-footer-toggle) {
    background: linear-gradient(135deg, #2a2a2a 0%, #333333 100%);
    border-top: 1px solid #555;
    color: #b0b0b0;
    font-size: 13px;
    font-weight: 500;
    padding: 12px 16px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #333333 0%, #404040 100%);
      color: #e0e0e0;
      border-color: #666;
    }
  }

  // 美化切換圖標
  :deep(.fold-bar-toggle-icon) {
    color: #007acc;
    font-size: 14px;
    font-weight: bold;
  }

  // 不完整角色的樣式
  &.character-incomplete {
    :deep(.fold-bar-btn span) {
      color: #ff6b6b !important;
    }
  }
}

// 移除角色按鈕樣式
.remove-character-btn {
  background: #b91c1c;
  border: 1px solid #b91c1c;
  border-radius: 3px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  span {
    line-height: 1;
    margin-top: -1px;
  }
}

.character-info-container {
  .section {
    margin-bottom: 16px;
  }
}

.section {
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #404040;
  margin-bottom: 20px;

  h4 {
    color: #b0b0b0;
    margin-bottom: 16px;
    font-size: 16px;
    border-bottom: 1px solid #404040;
    padding-bottom: 8px;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

// 輸入組樣式
.input-group {
  &.full-width {
    grid-column: 1 / -1;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: #b0b0b0;
    font-weight: 500;
  }
}

.text-input {
  width: 100%;
  padding: 12px 16px;
  background-color: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007acc;
  }

  &::placeholder {
    color: #666;
  }
}

.text-area {
  width: 100%;
  padding: 12px 16px;
  background-color: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007acc;
  }

  &::placeholder {
    color: #666;
  }
}

.birthday-inputs {
  display: flex;
  gap: 8px;

  .birthday-input {
    flex: 1;
    padding: 12px 16px;
    background-color: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 8px;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #007acc;
    }

    &::placeholder {
      color: #666;
    }
  }
}

.relations-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.relation-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #1e1e1e 0%, #252525 100%);
  border: 1px solid #555;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #666;
  }

  .relation-target {
    color: #4fc3f7;
    font-weight: 600;
    font-size: 13px;
    flex-shrink: 0;
    min-width: 60px;
    padding: 6px 8px;
    background-color: #2a2a2a;
    border-radius: 4px;
    text-align: center;
  }

  .relation-input {
    flex: 1;
    min-width: 120px;
    padding: 10px 14px;
    background-color: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }

    &::placeholder {
      color: #888;
    }
  }

  .remove-relation-btn {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    border: 1px solid #dc3545;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);

    &:hover {
      background: linear-gradient(135deg, #c82333 0%, #a02622 100%);
      border-color: #bd2130;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(220, 53, 69, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.add-relation {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 12px;
  background: linear-gradient(135deg, #252525 0%, #2a2a2a 100%);
  border: 1px solid #555;
  border-radius: 8px;
  margin-top: 12px;

  .relation-select {
    flex: 1;
    min-width: 150px;
    padding: 12px 16px;
    background-color: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }
  }

  .add-relation-btn {
    flex-shrink: 0;
    padding: 10px 16px;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    border: 1px solid #28a745;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #218838 0%, #1aa085 100%);
      border-color: #218838;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
    }

    &:disabled {
      background-color: #666;
      border-color: #666;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inventory-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #1e1e1e 0%, #252525 100%);
  border: 1px solid #555;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #666;
  }

  .inventory-target {
    color: #4fc3f7;
    font-weight: 600;
    font-size: 13px;
    flex-shrink: 0;
    min-width: 60px;
    padding: 6px 8px;
    background-color: #2a2a2a;
    border-radius: 4px;
    text-align: center;
  }

  .inventory-input {
    flex: 1;
    min-width: 120px;
    padding: 10px 14px;
    background-color: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }

    &::placeholder {
      color: #888;
    }
  }

  .remove-inventory-btn {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    border: 1px solid #dc3545;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);

    &:hover {
      background: linear-gradient(135deg, #c82333 0%, #a02622 100%);
      border-color: #bd2130;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(220, 53, 69, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.add-inventory {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 12px;
  background: linear-gradient(135deg, #252525 0%, #2a2a2a 100%);
  border: 1px solid #555;
  border-radius: 8px;
  margin-top: 12px;

  .inventory-select {
    flex: 1;
    min-width: 150px;
    padding: 12px 16px;
    background-color: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }
  }

  .quantity-input {
    flex: 1;
    min-width: 80px;
    padding: 12px 16px;
    background-color: #1a1a1a;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #e0e0e0;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #007acc;
      box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }

    &::placeholder {
      color: #888;
    }

    &:disabled {
      background-color: #333;
      color: #666;
      cursor: not-allowed;
    }
  }

  .add-inventory-btn {
    flex-shrink: 0;
    padding: 10px 16px;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    border: 1px solid #28a745;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #218838 0%, #1aa085 100%);
      border-color: #218838;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
    }

    &:disabled {
      background-color: #666;
      border-color: #666;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 生成結果樣式
.generated-result {
  margin-top: 8px;
  padding: 8px;
  background-color: #1a1a1a;
  border: 1px solid #404040;
  border-radius: 6px;

  label {
    display: block;
    margin-bottom: 4px;
    color: #007acc;
    font-size: 12px;
    font-weight: 500;
  }

  .generated-text {
    color: #e0e0e0;
    font-size: 14px;
    margin-bottom: 8px;
    word-wrap: break-word;
  }

  .replace-btn {
    padding: 6px 12px;
    background-color: #28a745;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #218838;
    }
  }
}

// 動作區域樣式
.action-section {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 0;

  .generate-btn,
  .apply-all-btn {
    flex: 1;
    max-width: none;
  }
}

// 添加角色區域樣式
.add-character-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid #404040;
}

.add-character-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: 1px solid #28a745;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #218838 0%, #1aa085 100%);
    border-color: #218838;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }

  span {
    font-size: 18px;
    font-weight: bold;
  }
}

.generate-btn {
  padding: 14px 32px;
  background-color: #28a745;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background-color: #218838;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.apply-all-btn {
  padding: 14px 32px;
  background-color: #007acc;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .section {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .input-group {
    &.full-width {
      grid-column: 1;
    }
  }

  .birthday-inputs {
    flex-direction: column;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;

    label {
      min-width: unset;
    }
  }

  .character-tabs-container {
    max-width: 100%;
    margin: 0;
  }

  .action-section {
    flex-direction: row;
    align-items: stretch;
    gap: 12px;

    .generate-btn,
    .apply-all-btn {
      flex: 1;
      width: auto;
      max-width: none;
    }
  }

  .add-character-section {
    padding: 16px 0;
    margin-top: 16px;
  }

  .add-character-btn {
    padding: 10px 20px;
    font-size: 14px;

    span {
      font-size: 16px;
    }
  }

  .remove-character-btn {
    width: 20px;
    height: 20px;
    font-size: 14px;
  }

}
</style>
